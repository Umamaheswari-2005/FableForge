import React from "react";

export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>FableForge</h1>
      <p style={styles.tagline}>Where fables are crafted - one moral at a time.</p>
      <p style={styles.sub}>Crafting stories, shaping morals</p>
    </header>
  );
}

const styles = {
  header: { marginBottom: "1.25rem", textAlign: "center" },
  title: {
    fontFamily: "var(--ff-serif)",
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 700,
    background: "linear-gradient(135deg,#b5451b 0%,#e8973a 40%,#c0392b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1.1,
    margin: 0,
  },
  tagline: {
    fontFamily: "var(--ff-body)",
    fontStyle: "italic",
    fontSize: "1.1rem",
    color: "var(--bark)",
    margin: "0.2rem 0 0",
  },
  sub: {
    fontFamily: "var(--ff-ui)",
    fontSize: "0.92rem",
    color: "#6b4c30",
    marginTop: "0.45rem",
  },
};
