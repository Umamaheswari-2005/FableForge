"""
FableForge NLP Pipeline
NLTK · spaCy · TextBlob · VADER
"""

from __future__ import annotations
import os
import functools

import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk.sentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import spacy

# ─── One-time resource bootstrap ──────────────────────────────────────────────

def _bootstrap_nltk():
    resources = [
        ("tokenizers/punkt",           "punkt"),
        ("tokenizers/punkt_tab",       "punkt_tab"),
        ("corpora/stopwords",          "stopwords"),
        ("sentiment/vader_lexicon",    "vader_lexicon"),
        ("taggers/averaged_perceptron_tagger", "averaged_perceptron_tagger"),
        ("taggers/averaged_perceptron_tagger_eng", "averaged_perceptron_tagger_eng"),
    ]
    for path, pkg in resources:
        try:
            nltk.data.find(path)
        except LookupError:
            nltk.download(pkg, quiet=True)

_bootstrap_nltk()

@functools.lru_cache(maxsize=1)
def _load_resources():
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        os.system("python -m spacy download en_core_web_sm -q")
        nlp = spacy.load("en_core_web_sm")
    sia = SentimentIntensityAnalyzer()
    sw  = set(stopwords.words("english"))
    return nlp, sia, sw

# ─── Main pipeline ─────────────────────────────────────────────────────────────

def run_nlp_pipeline(text: str) -> dict:
    nlp, sia, sw = _load_resources()

    sentences  = sent_tokenize(text)
    all_tokens = word_tokenize(text)
    clean_tok  = [w.lower() for w in all_tokens if w.isalpha() and w.lower() not in sw]

    # Keywords via FreqDist
    freq     = FreqDist(clean_tok)
    keywords = [w for w, _ in freq.most_common(10)]

    # POS richness
    pos_tags    = nltk.pos_tag(all_tokens)
    descriptive = sum(1 for _, t in pos_tags if t in ("JJ","JJR","JJS","RB","RBR"))
    richness    = round(min(descriptive / max(len(pos_tags), 1) * 4, 1.0), 2)

    # NER via spaCy
    doc      = nlp(text[:100_000])
    entities = [[str(ent.text), str(ent.label_)] for ent in doc.ents]
    char_names = list(dict.fromkeys(
        [e[0] for e in entities if e[1] in ("PERSON", "ORG")]
    ))[:5]

    # Sentiment (VADER + TextBlob)
    vader           = sia.polarity_scores(text)
    sentiment_score = round((vader["compound"] + 1) / 2, 2)
    blob            = TextBlob(text)
    subjectivity    = round(float(blob.sentiment.subjectivity), 2)

    # Coherence: sentence-level VADER variance
    sent_scores = [sia.polarity_scores(s)["compound"] for s in sentences]
    if len(sent_scores) > 1:
        variance  = sum(abs(sent_scores[i] - sent_scores[i-1])
                        for i in range(1, len(sent_scores))) / len(sent_scores)
        coherence = round(max(0.0, 1.0 - variance), 2)
    else:
        coherence = 0.7

    # Readability
    avg_len     = len(all_tokens) / max(len(sentences), 1)
    readability = round(max(0.0, 1.0 - abs(avg_len - 18) / 22), 2)

    # Engagement composite
    engagement = round(0.35 * sentiment_score + 0.35 * richness + 0.30 * readability, 2)

    return {
        "keywords":       keywords,
        "entities":       entities,
        "char_names":     char_names,
        "sentiment":      sentiment_score,
        "subjectivity":   subjectivity,
        "coherence":      coherence,
        "readability":    readability,
        "richness":       richness,
        "engagement":     engagement,
        "sentence_count": len(sentences),
        "word_count":     len(all_tokens),
        "vader": {k: round(float(v), 3) for k, v in vader.items()},
    }


def detect_moral_sentence(text: str) -> str:
    """Return the sentence most likely to contain the moral."""
    _, _, sw = _load_resources()
    moral_kw = {
        "honest","truth","kind","courage","humble","greed","patience","wisdom",
        "love","forgive","trust","respect","share","help","learn","care","give",
        "justice","hope","always","never","lesson","taught","realised","realized",
        "understood","remembered","believe","heart","virtue","pride","sacrifice",
        "redemption",
    }
    sentences = sent_tokenize(text)
    if not sentences:
        return ""
    best, best_score = sentences[-1], -1
    for s in sentences:
        score = len(set(word_tokenize(s.lower())) & moral_kw)
        if score > best_score:
            best, best_score = s, score
    return str(best)


def jaccard_moral_clarity(moral: str, story: str) -> float:
    """Jaccard similarity between moral tokens and story tokens."""
    _, _, sw = _load_resources()

    def tok(t: str) -> set:
        return {w.lower() for w in word_tokenize(t) if w.isalpha() and w.lower() not in sw}

    m, s = tok(moral), tok(story)
    if not m or not s:
        return 0.5
    return round(min(len(m & s) / len(m | s) * 3, 1.0), 2)


def agent_evaluator(nlp_scores: dict, moral_clarity: float) -> dict:
    e = min(float(nlp_scores["engagement"]),  1.0)
    c = min(float(nlp_scores["coherence"]),   1.0)
    s = min(float(nlp_scores["sentiment"]),   1.0)
    m = min(float(moral_clarity),             1.0)
    return {
        "engagement":    round(e, 2),
        "coherence":     round(c, 2),
        "sentiment":     round(s, 2),
        "moral_clarity": round(m, 2),
        "overall":       round((e + c + s + m) / 4, 2),
    }