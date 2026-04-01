import React from "react";

function badge(score) {
  if (score >= 0.65) return { bg: "#d4edda", color: "#155724" };
  if (score >= 0.40) return { bg: "#fff3cd", color: "#856404" };
  return                  { bg: "#f8d7da", color: "#721c24" };
}

function Badge({ label, score }) {
  const { bg, color } = badge(score);
  return (
    <div style={{ ...styles.badge, background: bg, color }}>
      <span style={styles.badgeLabel}>{label}</span>
      <span style={styles.badgeScore}>{Math.round(score * 100)}%</span>
    </div>
  );
}

export default function EvalBadges({ evaluation }) {
  if (!evaluation) return null;
  const { engagement, coherence, sentiment, moral_clarity, overall } = evaluation;

  const verdict =
    overall >= 0.72 ? "🌟 A masterwork from the forge!" :
    overall >= 0.55 ? "⚒️ A solid fable, well-crafted." :
    "🔥 The forge needs more heat — try a richer prompt.";

  return (
    <div style={styles.wrap}>
      <h3 style={styles.heading}>🔍 FableForge NLP Quality Scores</h3>
      <div style={styles.grid}>
        <Badge label="🎭 Engagement"    score={engagement} />
        <Badge label="🔗 Coherence"     score={coherence} />
        <Badge label="😊 Sentiment"     score={sentiment} />
        <Badge label="📚 Moral Clarity" score={moral_clarity} />
      </div>
      <p style={styles.caption}>
        Engagement = VADER×richness×readability · Coherence = sentence VADER variance · Moral Clarity = Jaccard(moral∩story)
      </p>
      <div style={styles.overall}>
        <strong>Overall FableForge Score:</strong> {Math.round(overall * 100)}% — {verdict}
      </div>
    </div>
  );
}

const styles = {
  wrap: { marginBottom: "1.5rem" },
  heading: {
    fontFamily: "var(--ff-ui)", fontWeight: 700,
    fontSize: "1rem", color: "var(--ink)", marginBottom: "0.75rem",
  },
  grid: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" },
  badge: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    padding: "0.4rem 1rem", borderRadius: "20px",
    fontFamily: "var(--ff-ui)", fontWeight: 700, fontSize: "0.85rem",
  },
  badgeLabel: {},
  badgeScore: { fontSize: "1rem" },
  caption: { fontSize: "0.75rem", color: "var(--bark)", marginBottom: "0.75rem" },
  overall: {
    background: "var(--cream)", border: "1px solid var(--gold)",
    borderRadius: "8px", padding: "0.75rem 1rem",
    fontFamily: "var(--ff-ui)", fontSize: "0.9rem", color: "var(--ink)",
  },
};