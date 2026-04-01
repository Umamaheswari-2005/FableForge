import React from "react";

export default function ChatThread({ stories, onFeedback }) {
  if (!stories.length) {
    return <p style={styles.empty}>No story yet. Enter a prompt to start forging.</p>;
  }

  return (
    <div style={styles.thread}>
      {stories.map((s) => (
        <div key={s._id || `${s.prompt}-${s.createdAt || ""}`} style={styles.block}>
          <div style={{ ...styles.bubble, ...styles.userBubble }}>
            <p style={styles.userLabel}>You</p>
            <p>{s.prompt}</p>
          </div>

          <div style={{ ...styles.bubble, ...styles.assistantBubble }}>
            <p style={styles.assistantLabel}>FableForge</p>
            <div style={styles.story}>{s.story}</div>
            <div style={styles.moralWrap}>
              <p style={styles.moralLabel}>Moral</p>
              <p style={styles.moral}>{s.moral}</p>
            </div>

            {s._id && (
              <div style={styles.feedbackWrap}>
                {s.feedback ? (
                  <p style={styles.feedbackText}>
                    Feedback: {s.feedback === "positive" ? "Masterpiece!" : "Needs work"}
                  </p>
                ) : (
                  <>
                    <span style={styles.feedbackPrompt}>Feedback:</span>
                    <button style={styles.feedbackBtn} onClick={() => onFeedback(s._id, "positive")}>
                      Masterpiece
                    </button>
                    <button
                      style={{ ...styles.feedbackBtn, ...styles.feedbackBtnAlt }}
                      onClick={() => onFeedback(s._id, "negative")}
                    >
                      Needs work
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  thread: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    paddingBottom: "1rem",
  },
  empty: { color: "var(--bark)", fontSize: "0.95rem" },
  block: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  bubble: {
    borderRadius: "12px",
    padding: "0.9rem 1rem",
    border: "1px solid #e8ddd0",
    boxShadow: "0 1px 4px var(--shadow)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
  },
  userBubble: {
    marginLeft: "auto",
    maxWidth: "78%",
    background: "#fff4e8",
  },
  assistantBubble: {
    marginRight: "auto",
    maxWidth: "92%",
    background: "white",
  },
  userLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#8b5a34", marginBottom: "0.2rem" },
  assistantLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#5a3e28", marginBottom: "0.45rem" },
  story: {
    fontFamily: "var(--ff-body)",
    fontSize: "1.05rem",
    color: "var(--ink)",
    marginBottom: "0.9rem",
  },
  moralWrap: {
    background: "#fbefe0",
    border: "1px solid #e5c9a2",
    borderRadius: "8px",
    padding: "0.7rem 0.8rem",
  },
  moralLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#8b5a34", marginBottom: "0.2rem" },
  moral: { fontStyle: "italic", color: "#4a2c0a" },
  feedbackWrap: {
    marginTop: "0.8rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  feedbackPrompt: { fontSize: "0.82rem", color: "var(--bark)", fontWeight: 700 },
  feedbackText: { fontSize: "0.82rem", color: "#6b4c30", fontWeight: 700 },
  feedbackBtn: {
    padding: "0.35rem 0.8rem",
    borderRadius: "999px",
    border: "none",
    background: "#b5451b",
    color: "white",
    fontSize: "0.78rem",
    cursor: "pointer",
  },
  feedbackBtnAlt: {
    background: "white",
    color: "#b5451b",
    border: "1px solid #b5451b",
  },
};
