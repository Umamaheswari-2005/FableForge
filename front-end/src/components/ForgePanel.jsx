import React, { useState } from "react";

const EXAMPLES = [
  "A crow who learned the price of vanity",
  "Two brothers who divided an ancient forest",
  "A lighthouse keeper and a mermaid's bargain",
  "A king who could turn anything to gold",
];

export default function ForgePanel({ onForge, loading }) {
  const [prompt, setPrompt] = useState("");

  const handle = (p) => {
    if (!p.trim() || loading) return;
    onForge(p.trim());
  };

  return (
    <div style={styles.panel}>
      <div style={styles.inputRow}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handle(prompt)}
          placeholder="e.g. A humble blacksmith discovers a sword that grants any wish..."
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={() => handle(prompt)}
          disabled={loading || !prompt.trim()}
          style={{ ...styles.btn, opacity: loading || !prompt.trim() ? 0.55 : 1 }}
        >
          {loading ? "Forging..." : "Forge My Fable"}
        </button>
      </div>

      <div>
        <p style={styles.sparksLabel}>Spark an idea:</p>
        <div style={styles.sparks}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setPrompt(ex);
              }}
              disabled={loading}
              style={styles.chip}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: "white",
    border: "1px solid #e8ddd0",
    borderRadius: "10px",
    padding: "1.2rem",
    marginBottom: "1.2rem",
    boxShadow: "0 2px 8px var(--shadow)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputRow: { display: "flex", gap: "0.75rem" },
  input: {
    flex: 1,
    padding: "0.7rem 1rem",
    border: "2px solid #d4a96a",
    borderRadius: "8px",
    fontFamily: "var(--ff-ui)",
    fontSize: "1rem",
    background: "var(--cream)",
    color: "var(--ink)",
    outline: "none",
  },
  btn: {
    padding: "0.7rem 1.5rem",
    background: "linear-gradient(135deg,#b5451b,#e8973a)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontFamily: "var(--ff-ui)",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 12px rgba(181,69,27,.35)",
  },
  sparksLabel: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--bark)",
    marginBottom: "0.4rem",
  },
  sparks: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  chip: {
    padding: "0.35rem 0.9rem",
    background: "var(--cream)",
    border: "1px solid var(--gold)",
    borderRadius: "20px",
    cursor: "pointer",
    fontFamily: "var(--ff-ui)",
    fontSize: "0.82rem",
    color: "#7b3f00",
  },
};
