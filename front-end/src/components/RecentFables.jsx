import React from "react";

export default function RecentFables({ stories, onSelect }) {
  return (
    <div>
      <h3 style={styles.heading}>Recent Fables</h3>
      {stories.length === 0 && <p style={styles.empty}>No fables forged yet.</p>}
      {stories.slice(0, 8).map((s) => (
        <button key={s._id} style={styles.card} onClick={() => onSelect?.(s._id)}>
          <p style={styles.prompt}>{(s.prompt || "").slice(0, 45)}...</p>
          <p style={styles.time}>{new Date(s.createdAt).toLocaleString()}</p>
        </button>
      ))}
    </div>
  );
}

const styles = {
  heading: {
    fontFamily: "var(--ff-ui)",
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "var(--ink)",
    marginBottom: "0.75rem",
  },
  empty: { fontSize: "0.82rem", color: "var(--bark)" },
  card: {
    width: "100%",
    textAlign: "left",
    background: "#fdf5ec",
    borderLeft: "3px solid var(--rust)",
    borderTop: "none",
    borderRight: "none",
    borderBottom: "none",
    borderRadius: "6px",
    padding: "0.6rem 0.9rem",
    marginBottom: "0.7rem",
    cursor: "pointer",
  },
  prompt: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--ink)",
    marginBottom: "0.2rem",
  },
  time: { fontSize: "0.75rem", color: "var(--bark)" },
};
