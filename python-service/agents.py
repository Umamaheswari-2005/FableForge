"""
FableForge LLM Agents
LangChain + Groq
"""

from __future__ import annotations
import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

# Supported model ids shared with the MERN frontend.
MODELS = {
    "llama-3.3-70b-versatile": "LLaMA 3.3 70B",
    "llama-3.1-8b-instant": "LLaMA 3.1 8B",
    "meta-llama/llama-4-scout-17b-16e-instruct": "LLaMA 4 Scout",
}


def _llm(model: str, temp: float) -> ChatGroq:
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GROQ_API_KEY is missing. Set it in environment variables.")
    return ChatGroq(api_key=api_key, model_name=model, temperature=temp)
def _call(llm: ChatGroq, system: str, user: str) -> str:
    return llm.invoke([
        SystemMessage(content=system),
        HumanMessage(content=user),
    ]).content.strip()


# ─── Agent 1: Story ────────────────────────────────────────────────────────────

def agent_story(model: str, prompt: str, keywords: list[str]) -> str:
    system = """You are a master novelist and fabulist in the tradition of Leo Tolstoy,
Gabriel García Márquez, and Aesop. You write long, deeply immersive fables that feel
like chapters from a great novel — rich with sensory detail, complex characters,
unexpected twists, layered emotions, and unforgettable imagery.

Your stories must:
- Open with a powerful, cinematic scene that immediately draws the reader in
- Build a vivid world with specific sights, sounds, smells, and textures
- Feature complex, flawed, deeply human (or animal) characters with backstories
- Include meaningful dialogue that reveals character and advances the plot
- Have rising tension, a turning point, and a deeply satisfying resolution
- Weave the moral lesson naturally into the fabric of events — never state it as a tag
- Feel complete and unhurried — write at least 600–900 words, or longer if the story demands

Do NOT write a 'Moral:' line. Do NOT rush. Let every scene breathe."""

    user = (
        f'Craft a rich, novel-style fable for FableForge inspired by: "{prompt}"\n\n'
        f"Weave these thematic elements naturally: {', '.join(keywords)}\n\n"
        "Write until the story is fully and satisfyingly complete. "
        "Do not truncate. Every paragraph should deepen the world or the characters."
    )
    return _call(_llm(model, 0.9), system, user)


# ─── Agent 2: Moral ────────────────────────────────────────────────────────────

def agent_moral(model: str, story: str, nlp_hint: str) -> str:
    system = (
        "You are a literary analyst. Distil the story's single deepest moral truth. "
        "Express it as one luminous, memorable sentence (12–22 words). Return ONLY that sentence."
    )
    user = (
        f"Story:\n{story}\n\n"
        f'NLP moral hint: "{nlp_hint}"\n'
        "Return the single best moral sentence."
    )
    return _call(_llm(model, 0.3), system, user).strip("\"'")


# ─── Agent 3: Refinement ───────────────────────────────────────────────────────

def agent_refinement(
    model: str,
    story: str,
    moral: str,
    chars: list[str],
) -> tuple[str, str]:
    system = (
        "You are a master literary editor. Refine the story's final passages so the moral "
        "emerges organically — voiced by a character, shown through consequence, or crystallised "
        "in a narrator reflection. Expand the ending if needed — never shorten the story. "
        "Return: full refined story, then '---MORAL---', then the moral sentence."
    )
    char_str = ", ".join(chars) if chars else "the protagonist"
    user = (
        f'Moral to embed: "{moral}"\n'
        f"Characters (NER): {char_str}\n\n"
        f"Story:\n{story}\n\n"
        "Return full story (do not shorten), ---MORAL---, moral sentence."
    )
    result = _call(_llm(model, 0.75), system, user)
    if "---MORAL---" in result:
        parts = result.split("---MORAL---", 1)
        return parts[0].strip(), parts[1].strip().strip("\"'")
    return result.strip(), moral
