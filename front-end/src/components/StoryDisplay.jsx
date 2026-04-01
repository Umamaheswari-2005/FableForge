import React from "react";

export default function StoryDisplay({ prompt, story, moral }) {
  const paragraphs = story
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const handleDownload = () => {
    const text = `FableForge\n${"═".repeat(50)}\n\nPrompt: ${prompt}\n\n${story}\n\n${"─".repeat(50)}\n⚒ Forged Moral: ${moral}\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "fableforge_story.txt";
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container} className="fade-up">
      {/* Decorative inner border */}
      <div style={styles.innerBorder} />

      <h2 style={styles.title}>
        ✦ {prompt.trim().replace(/\.$/, "").replace(/\b\w/g, (c) => c.toUpperCase())} ✦
      </h2>

      <div style={styles.storyText}>
        {paragraphs.map((p, i) => (
          <p key={i} style={styles.para}>{p}</p>
        ))}
      </div>

      {/* Moral */}
      <div style={styles.moralBox}>
        <div style={styles.moralLabel}>⚒ &nbsp; Forged Moral &nbsp; ⚒</div>
        <div style={styles.moralText}>{moral}</div>
      </div>

      {/* Download */}
      <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
        <button onClick={handleDownload} style={styles.dlBtn}>
          📜 Download Your Fable
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(160deg,#fdf8f0,#fef6e4,#fdf3e3)",
    border: "1px solid var(--gold)",
    borderRadius: "4px",
    padding: "3rem 3.5rem",
    margin: "1.5rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,.06), inset 0 0 60px rgba(212,169,106,.08)",
    position: "relative",
  },
  innerBorder: {
    position: "absolute", top: 12, left: 12, right: 12, bottom: 12,
    border: "1px solid rgba(212,169,106,0.3)", borderRadius: "2px",
    pointerEvents: "none",
  },
  title: {
    fontFamily: "var(--ff-serif)",
    fontSize: "1.6rem", fontWeight: 700, color: "#4a2c0a",
    textAlign: "center", marginBottom: "1.5rem", letterSpacing: "0.03em",
  },
  storyText: { position: "relative" },
  para: {
    fontFamily: "var(--ff-body)",
    fontSize: "1.18rem", lineHeight: 2.0,
    color: "var(--ink)", textAlign: "justify",
    marginBottom: "1rem",
    textIndent: "2em",
  },
  moralBox: {
    background: "linear-gradient(135deg,#4a1942 0%,#b5451b 50%,#7b2d00 100%)",
    borderRadius: "6px", padding: "1.4rem 2.5rem",
    marginTop: "2rem", color: "#fff", textAlign: "center",
    boxShadow: "0 6px 20px rgba(74,25,66,.35)",
  },
  moralLabel: {
    fontSize: "0.72rem", textTransform: "uppercase",
    letterSpacing: "3px", opacity: 0.75, marginBottom: "0.4rem",
  },
  moralText: {
    fontFamily: "var(--ff-serif)", fontStyle: "italic",
    fontSize: "1.15rem", lineHeight: 1.5,
  },
  dlBtn: {
    padding: "0.6rem 1.5rem",
    background: "var(--cream)", border: "1px solid var(--gold)",
    borderRadius: "20px", cursor: "pointer",
    fontFamily: "var(--ff-ui)", fontSize: "0.9rem", color: "#7b3f00",
    fontWeight: 600, transition: "background 0.15s",
  },
};