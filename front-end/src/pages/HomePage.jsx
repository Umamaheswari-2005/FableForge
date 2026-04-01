import React from "react";
import Header from "../components/Header";
import ForgePanel from "../components/ForgePanel";
import AgentProgress from "../components/AgentProgress";
import StoryDisplay from "../components/StoryDisplay";
import RecentFables from "../components/RecentFables";
import { useFableForge } from "../hooks/useFableForge";

export default function HomePage() {
  const { stories, result, loading, progress, stepMsg, error, forge, sendFeedback, loadStories } = useFableForge();
  const [model, setModel] = React.useState("llama-3.3-70b-versatile");
  const [selectedId, setSelectedId] = React.useState(null);
  const [feedbackSent, setFeedbackSent] = React.useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    loadStories();
  }, [loadStories]);

  React.useEffect(() => {
    if (result?._id) {
      setSelectedId(result._id);
      setFeedbackSent(result.feedback || null);
    }
  }, [result]);

  const handleForge = (prompt) => {
    forge(prompt, model);
  };

  const handleSidebarSelect = (id) => {
    setSelectedId(id);
    const selected = stories.find((s) => s._id === id);
    setFeedbackSent(selected?.feedback || null);
  };

  const currentStory = selectedId
    ? stories.find((s) => s._id === selectedId)
    : result;

  const handleFeedback = async (type) => {
    if (!currentStory?._id || feedbackSent) return;
    await sendFeedback(currentStory._id, type);
    setFeedbackSent(type);
  };

  return (
    <div
      style={{
        ...styles.layout,
        gridTemplateColumns: sidebarCollapsed ? "72px 1fr" : "280px 1fr",
      }}
    >
      <aside style={{ ...styles.sidebar, width: sidebarCollapsed ? "72px" : "280px" }}>
        <button
          style={styles.collapseBtn}
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? "»" : "«"}
        </button>

        {!sidebarCollapsed ? (
          <>
            <div style={styles.sideSection}>
              <h3 style={styles.sideTitle}>Settings</h3>
              <label style={styles.modelLabel}>Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} style={styles.select}>
                <option value="llama-3.3-70b-versatile">LLaMA 3.3 70B - Best quality</option>
                <option value="llama-3.1-8b-instant">LLaMA 3.1 8B - Fastest</option>
                <option value="meta-llama/llama-4-scout-17b-16e-instruct">LLaMA 4 Scout - Balanced</option>
              </select>
            </div>

            <div style={styles.sideSection}>
              <RecentFables stories={[...stories].reverse()} onSelect={handleSidebarSelect} />
            </div>
          </>
        ) : (
          <div style={styles.collapsedRail}>
            <div style={styles.railDot}>⚙</div>
            <div style={styles.railDot}>🕘</div>
          </div>
        )}
      </aside>

      <main style={styles.main}>
        <Header />
        <ForgePanel onForge={handleForge} loading={loading} />

        {error && (
          <div style={styles.errorBox}>
            {error}
            <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
              Check your Groq API key and that the Python service is running on port 8000.
            </p>
          </div>
        )}

        {loading && <AgentProgress progress={progress} stepMsg={stepMsg} />}

        {currentStory && !loading && (
          <>
            <StoryDisplay
              prompt={currentStory.prompt || ""}
              story={currentStory.story}
              moral={currentStory.moral}
            />

            <div style={styles.feedback}>
              <p style={styles.feedbackTitle}>Did this fable move you?</p>
              {feedbackSent ? (
                <p style={styles.feedbackThanks}>
                  {feedbackSent === "positive"
                    ? "The forge glows with pride. Thank you!"
                    : "Back to the anvil - we'll forge it sharper next time."}
                </p>
              ) : (
                <div style={styles.feedbackBtns}>
                  <button onClick={() => handleFeedback("positive")} style={styles.fbBtn}>Masterpiece!</button>
                  <button onClick={() => handleFeedback("negative")} style={{ ...styles.fbBtn, ...styles.fbBtnAlt }}>Needs work</button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "grid",
    gap: "2rem",
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "2rem",
    minHeight: "100vh",
    alignItems: "start",
  },
  sidebar: {
    position: "sticky",
    top: "2rem",
    transition: "width 0.2s ease",
  },
  collapseBtn: {
    width: "100%",
    border: "1px solid #e8ddd0",
    background: "white",
    color: "var(--bark)",
    borderRadius: "10px",
    padding: "0.35rem 0.5rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    cursor: "pointer",
  },
  sideSection: {
    background: "white",
    border: "1px solid #e8ddd0",
    borderRadius: "10px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 8px var(--shadow)",
  },
  sideTitle: {
    fontFamily: "var(--ff-ui)",
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "var(--ink)",
    marginBottom: "0.5rem",
  },
  modelLabel: {
    display: "block",
    fontSize: "0.8rem",
    color: "var(--bark)",
    marginBottom: "0.35rem",
    fontWeight: 700,
  },
  select: {
    width: "100%",
    padding: "0.55rem 0.75rem",
    border: "1px solid #d4a96a",
    borderRadius: "6px",
    fontFamily: "var(--ff-ui)",
    fontSize: "0.9rem",
    background: "var(--cream)",
    color: "var(--ink)",
    cursor: "pointer",
  },
  collapsedRail: {
    background: "white",
    border: "1px solid #e8ddd0",
    borderRadius: "10px",
    padding: "0.8rem 0.45rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    alignItems: "center",
    boxShadow: "0 2px 8px var(--shadow)",
  },
  railDot: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    border: "1px solid #e3d4c1",
    background: "#fffaf2",
    color: "#7d5a3c",
    fontSize: "1rem",
  },
  main: { minWidth: 0 },
  errorBox: {
    background: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "#721c24",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  feedback: {
    background: "var(--cream)",
    border: "1px solid var(--gold)",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
    marginBottom: "1.5rem",
  },
  feedbackTitle: { fontWeight: 700, marginBottom: "0.6rem" },
  feedbackThanks: { fontSize: "0.9rem", color: "var(--rust)", fontWeight: 600 },
  feedbackBtns: { display: "flex", gap: "0.75rem" },
  fbBtn: {
    padding: "0.5rem 1.25rem",
    background: "linear-gradient(135deg,#b5451b,#e8973a)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontFamily: "var(--ff-ui)",
    fontWeight: 700,
    fontSize: "0.88rem",
  },
  fbBtnAlt: {
    background: "white",
    color: "var(--rust)",
    border: "1px solid var(--rust)",
  },
};
