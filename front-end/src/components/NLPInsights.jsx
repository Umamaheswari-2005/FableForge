import React, { useState } from "react";

export default function NLPInsights({ nlp, moralHint, mcScore }) {
  const [open, setOpen] = useState(false);
  if (!nlp) return null;

  const { keywords, entities, word_count, sentence_count,
          vader, subjectivity, richness, readability } = nlp;

  const subjectivityLabel =
    subjectivity > 0.6 ? "Highly emotional" :
    subjectivity > 0.4 ? "Moderate" : "Objective";

  return (
    <div style={styles.wrap}>
      <button onClick={() => setOpen(!open)} style={styles.toggle}>
        🧠 NLP Insights &nbsp;{open ? "▲" : "▼"}
      </button>

      {open && (
        <div style={styles.body} className="fade-up">
          <div style={styles.grid}>

            {/* Left column */}
            <div>
              <Section title="🔑 Keywords (FreqDist)">
                <div style={styles.tagRow}>
                  {keywords.map((k) => (
                    <span key={k} style={styles.nlpTag}>{k}</span>
                  ))}
                </div>
              </Section>

              <Section title="👤 Named Entities (spaCy NER)">
                {entities.length ? (
                  <div style={styles.tagRow}>
                    {entities.slice(0, 12).map(([text, label], i) => (
                      <span key={i} style={styles.nerTag}>
                        {text} <small>({label})</small>
                      </span>
                    ))}
                  </div>
                ) : <p style={styles.muted}>No entities detected.</p>}
              </Section>

              <Section title="📐 Stats">
                <p style={styles.stat}>
                  Words: <b>{word_count}</b> &nbsp;|&nbsp;
                  Sentences: <b>{sentence_count}</b> &nbsp;|&nbsp;
                  Avg words/sent: <b>{Math.floor(word_count / Math.max(sentence_count, 1))}</b> &nbsp;|&nbsp;
                  Est. read: <b>{Math.max(1, Math.floor(word_count / 200))} min</b>
                </p>
              </Section>

              {moralHint && (
                <Section title="🔤 NLP Moral Hint">
                  <p style={styles.hint}>
                    "{moralHint.length > 150 ? moralHint.slice(0, 150) + "…" : moralHint}"
                  </p>
                </Section>
              )}
            </div>

            {/* Right column */}
            <div>
              <Section title="😊 VADER Sentiment">
                <MiniBar label={`Positive: ${(vader.pos * 100).toFixed(0)}%`} pct={vader.pos * 100} color="#2e7d32" />
                <MiniBar label={`Neutral: ${(vader.neu * 100).toFixed(0)}%`}  pct={vader.neu * 100} color="#5c6bc0" />
                <MiniBar label={`Negative: ${(vader.neg * 100).toFixed(0)}%`} pct={vader.neg * 100} color="#c62828" />
                <p style={styles.stat}>Compound: <code>{vader.compound.toFixed(3)}</code></p>
              </Section>

              <Section title="📊 TextBlob & Scores">
                <p style={styles.stat}>Subjectivity: <code>{subjectivity.toFixed(2)}</code> ({subjectivityLabel})</p>
                <p style={styles.stat}>Richness (POS): <code>{richness.toFixed(2)}</code></p>
                <p style={styles.stat}>Readability: <code>{readability.toFixed(2)}</code></p>
                {mcScore !== undefined && (
                  <p style={styles.stat}>Moral Clarity (Jaccard): <code>{mcScore.toFixed(2)}</code></p>
                )}
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--bark)", marginBottom: "0.4rem" }}>{title}</p>
      {children}
    </div>
  );
}

function MiniBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: "0.4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "2px" }}>
        <span>{label}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#e8ddd0", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

const styles = {
  wrap: { marginBottom: "1rem" },
  toggle: {
    width: "100%", padding: "0.7rem 1rem",
    background: "var(--cream)", border: "1px solid var(--gold)",
    borderRadius: "8px", cursor: "pointer",
    fontFamily: "var(--ff-ui)", fontWeight: 700, fontSize: "0.9rem",
    color: "#7b3f00", textAlign: "left",
  },
  body: {
    background: "#fff", border: "1px solid #e8ddd0", borderTop: "none",
    borderRadius: "0 0 8px 8px", padding: "1.5rem",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "0.3rem" },
  nlpTag: {
    background: "#fdefd5", color: "#7b3f00",
    border: "1px solid #f0c080", borderRadius: "20px",
    padding: "0.2rem 0.75rem", fontSize: "0.78rem",
  },
  nerTag: {
    background: "#f0eaff", color: "#4a1a8c",
    border: "1px solid #c9b0f5", borderRadius: "20px",
    padding: "0.2rem 0.75rem", fontSize: "0.78rem",
  },
  stat:  { fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.8 },
  hint:  { fontSize: "0.88rem", fontStyle: "italic", color: "#5a3e28", background: "#fff8f0", padding: "0.5rem 0.75rem", borderRadius: "6px" },
  muted: { fontSize: "0.82rem", color: "#a0714f" },
};