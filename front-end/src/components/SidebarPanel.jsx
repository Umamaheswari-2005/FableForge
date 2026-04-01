import React from "react";

const NAV_PRIMARY = [
  { id: "new", label: "New chat", icon: "edit" },
  { id: "library", label: "Library", icon: "stack" },
  { id: "tasks", label: "Tasks", icon: "check" },
];

const NAV_SECONDARY = [
  { id: "discover", label: "Discover", icon: "compass" },
  { id: "imagine", label: "Imagine", icon: "image" },
  { id: "labs", label: "Labs", icon: "flask" },
];

const MODEL_OPTIONS = [
  { id: "llama-3.3-70b-versatile", label: "LLaMA 3.3 70B - Best quality" },
  { id: "llama-3.1-8b-instant", label: "LLaMA 3.1 8B - Fastest" },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "LLaMA 4 Scout - Balanced" },
];

export default function SidebarPanel({
  model,
  onModelChange,
  stories,
  selectedId,
  onSelectStory,
  onNewChat,
}) {
  return (
    <aside style={styles.wrap}>
      <div style={styles.iconRail}>
        <div style={styles.logo} />
        <div style={styles.iconGroup}>
          {NAV_PRIMARY.map((item) => (
            <button
              key={item.id}
              style={styles.iconBtn}
              onClick={item.id === "new" ? onNewChat : undefined}
              title={item.label}
            >
              <Glyph type={item.icon} />
            </button>
          ))}
        </div>
        <div style={styles.divider} />
        <div style={styles.iconGroup}>
          {NAV_SECONDARY.map((item) => (
            <button key={item.id} style={styles.iconBtn} title={item.label}>
              <Glyph type={item.icon} />
            </button>
          ))}
        </div>
      </div>

      <div style={styles.panel}>
        <h3 style={styles.brand}>FableForge</h3>

        <div style={styles.menuBlock}>
          {NAV_PRIMARY.map((item) => (
            <button
              key={item.id}
              style={styles.menuBtn}
              onClick={item.id === "new" ? onNewChat : undefined}
            >
              <span style={styles.menuIcon}><Glyph type={item.icon} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.hr} />

        <div style={styles.menuBlock}>
          {NAV_SECONDARY.map((item) => (
            <button key={item.id} style={styles.menuBtn}>
              <span style={styles.menuIcon}><Glyph type={item.icon} /></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.hr} />

        <div style={styles.settings}>
          <p style={styles.settingsTitle}>Settings</p>
          <label style={styles.modelLabel}>Model</label>
          <select value={model} onChange={(e) => onModelChange(e.target.value)} style={styles.select}>
            {MODEL_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.hr} />

        <div style={styles.recentWrap}>
          <p style={styles.recentTitle}>Recent Fables</p>
          <div style={styles.recentList}>
            {[...stories].reverse().map((s) => (
              <button
                key={s._id}
                style={{
                  ...styles.storyBtn,
                  ...(selectedId === s._id ? styles.storyBtnActive : {}),
                }}
                onClick={() => onSelectStory(s._id)}
                title={s.prompt}
              >
                {(s.prompt || "").slice(0, 38)}
                {(s.prompt || "").length > 38 ? "..." : ""}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Glyph({ type }) {
  const base = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };

  if (type === "edit") return <svg {...base}><path d="M4 20h4l10-10-4-4L4 16v4z" /><path d="M13 7l4 4" /></svg>;
  if (type === "stack") return <svg {...base}><rect x="4" y="6" width="14" height="12" rx="2" /><path d="M10 4h10v12" /></svg>;
  if (type === "check") return <svg {...base}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></svg>;
  if (type === "compass") return <svg {...base}><circle cx="12" cy="12" r="9" /><path d="m10 10 6 2-2 6-6-2z" /></svg>;
  if (type === "image") return <svg {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-5 4 4 3-3 4 4" /></svg>;
  return <svg {...base}><path d="M9 3h6" /><path d="M10 3v4l-5 9a3 3 0 0 0 2.6 5h8.8A3 3 0 0 0 19 16l-5-9V3" /></svg>;
}

const styles = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "58px 1fr",
    width: "330px",
    height: "calc(100vh - 4rem)",
    position: "sticky",
    top: "2rem",
  },
  iconRail: {
    background: "linear-gradient(180deg,#0f1836,#060d24)",
    border: "1px solid #1f2a53",
    borderRight: "none",
    borderRadius: "12px 0 0 12px",
    padding: "0.8rem 0.55rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.8rem",
  },
  logo: {
    width: 25,
    height: 25,
    borderRadius: 8,
    background: "conic-gradient(from 30deg,#35c5ff,#6c6fff,#35c5ff,#ff8f45,#35c5ff)",
  },
  iconGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #33406a",
    background: "transparent",
    color: "#e1e7ff",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  divider: { width: "70%", borderTop: "1px solid #2d375c", margin: "0.2rem 0" },
  panel: {
    background: "linear-gradient(180deg,#0d1530,#070d22)",
    border: "1px solid #1f2a53",
    borderLeft: "1px solid #2a365f",
    borderRadius: "0 12px 12px 0",
    padding: "1rem",
    color: "#f3f5ff",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  brand: { fontSize: "1.5rem", marginBottom: "0.8rem", fontWeight: 700 },
  menuBlock: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  menuBtn: {
    border: "none",
    background: "transparent",
    color: "#e5e9ff",
    padding: "0.55rem 0.45rem",
    borderRadius: 10,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "0.55rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
  },
  menuIcon: { display: "inline-flex", color: "#d6ddff" },
  hr: { borderTop: "1px solid #2e395e", margin: "0.7rem 0" },
  settings: { marginBottom: "0.2rem" },
  settingsTitle: { fontSize: "0.95rem", marginBottom: "0.35rem", fontWeight: 700, color: "#f0f4ff" },
  modelLabel: { fontSize: "0.78rem", color: "#b8c3ee", display: "block", marginBottom: "0.25rem" },
  select: {
    width: "100%",
    border: "1px solid #394871",
    background: "#111b3e",
    color: "#ecf0ff",
    borderRadius: 8,
    padding: "0.5rem 0.65rem",
    fontSize: "0.86rem",
  },
  recentWrap: { display: "flex", flexDirection: "column", minHeight: 0, flex: 1 },
  recentTitle: { fontSize: "0.95rem", marginBottom: "0.5rem", fontWeight: 700 },
  recentList: { overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem", paddingRight: "0.2rem" },
  storyBtn: {
    border: "none",
    background: "transparent",
    color: "#d7defa",
    textAlign: "left",
    borderRadius: 10,
    padding: "0.48rem 0.55rem",
    cursor: "pointer",
    fontSize: "0.92rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  storyBtnActive: {
    background: "#2a3558",
    color: "#ffffff",
    fontWeight: 700,
  },
};
