import React from "react";

export default function AgentProgress({ progress, stepMsg }) {
  return (
    <div style={styles.wrap} className="fade-up">
      <div style={styles.forge}>
        <span style={styles.hammer}>🔨</span>
        <span style={styles.sparks}>✨</span>
      </div>
      <p style={styles.msg}>{stepMsg}</p>
      <div className="progress-bar-track" style={{ margin: "0.75rem 0" }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <p style={styles.pct}>{progress}%</p>
    </div>
  );
}

const styles = {
  wrap: {
    background: "linear-gradient(135deg,#fff8f0,#fef2e0)",
    border: "1px solid #d4a96a", borderRadius: "10px",
    padding: "2rem", textAlign: "center",
    boxShadow: "0 2px 8px var(--shadow)",
  },
  forge: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  hammer: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  sparks: {
    display: "inline-block",
    animation: "pulse 0.8s ease-in-out infinite",
    marginLeft: "0.5rem",
  },
  msg: {
    fontFamily: "var(--ff-ui)",
    fontSize: "0.95rem",
    color: "var(--rust)",
    fontWeight: 600,
  },
  pct: {
    fontSize: "0.8rem",
    color: "var(--bark)",
  },
};