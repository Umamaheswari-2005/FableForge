import { useState, useCallback } from "react";
import { forgeFable, getRecentStories, submitFeedback } from "../utils/api";

const STEPS = [
  { pct: 5,   label: "🧠 Analysing prompt — tokenisation & keyword extraction…" },
  { pct: 15,  label: "📝 Story Agent forging the fable — writing in novel style…" },
  { pct: 40,  label: "🧠 NLP Pipeline — POS, NER, VADER, coherence…" },
  { pct: 55,  label: "🧭 Moral Agent distilling the lesson…" },
  { pct: 70,  label: "✨ Refinement Agent weaving moral into the ending…" },
  { pct: 88,  label: "🔍 Evaluator Agent scoring with VADER · TextBlob · Jaccard…" },
  { pct: 100, label: "⚒️ Fable forged!" },
];

export function useFableForge() {
  const [stories,  setStories]  = useState([]);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepMsg,  setStepMsg]  = useState("");
  const [error,    setError]    = useState(null);

  const loadStories = useCallback(async () => {
    try {
      const data = await getRecentStories(30, 0);
      const ordered = [...(data.stories || [])].reverse();
      setStories(ordered);
    } catch (_) {
      // silent fetch fail
    }
  }, []);

  const forge = useCallback(async (prompt, model) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    // Animate through fake steps while waiting for server
    let stepIdx = 0;
    const tick = setInterval(() => {
      if (stepIdx < STEPS.length - 1) {
        setProgress(STEPS[stepIdx].pct);
        setStepMsg(STEPS[stepIdx].label);
        stepIdx++;
      }
    }, 1200);

    try {
      const data = await forgeFable(prompt, model);
      clearInterval(tick);
      setProgress(100);
      setStepMsg(STEPS[STEPS.length - 1].label);

      // Keep NLP and quality information available in browser console only.
      console.group("FableForge Debug");
      console.log("NLP Insights:", data.nlp);
      console.log("Evaluation:", data.evaluation);
      console.log("Keywords:", data.keywords);
      console.groupEnd();

      const created = {
        ...data,
        prompt: data.prompt || prompt,
        createdAt: data.createdAt || new Date().toISOString(),
      };

      setResult(created);
      setStories((prev) => [...prev, created]);
    } catch (err) {
      clearInterval(tick);
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendFeedback = useCallback(async (id, feedback) => {
    try {
      await submitFeedback(id, feedback);
      setStories((prev) =>
        prev.map((s) => (s._id === id ? { ...s, feedback } : s))
      );
      setResult((prev) => (prev && prev._id === id ? { ...prev, feedback } : prev));
    } catch (_) {
      // silent fail for feedback
    }
  }, []);

  return {
    stories,
    result,
    loading,
    progress,
    stepMsg,
    error,
    forge,
    sendFeedback,
    loadStories,
  };
}
