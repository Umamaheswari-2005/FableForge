const axios = require("axios");
const Story = require("../models/Story");

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8000";
const MODEL_OPTIONS = {
  "llama-3.3-70b-versatile": "LLaMA 3.3 70B - Best quality",
  "llama-3.1-8b-instant": "LLaMA 3.1 8B - Fastest",
  "meta-llama/llama-4-scout-17b-16e-instruct": "LLaMA 4 Scout - Balanced",
};
const DEFAULT_MODEL_ID = "llama-3.3-70b-versatile";

function resolveSelectedModel(inputModel) {
  if (!inputModel) {
    return { id: DEFAULT_MODEL_ID, label: MODEL_OPTIONS[DEFAULT_MODEL_ID] };
  }

  // Primary flow: frontend sends model id (value of <option>).
  if (MODEL_OPTIONS[inputModel]) {
    return { id: inputModel, label: MODEL_OPTIONS[inputModel] };
  }

  // Fallback: if any client sends display label, map it back to id.
  const byLabel = Object.entries(MODEL_OPTIONS).find(([, label]) => label === inputModel);
  if (byLabel) {
    return { id: byLabel[0], label: byLabel[1] };
  }

  return null;
}

// ── POST /api/fable/forge ────────────────────────────────────────────────────
exports.forge = async (req, res, next) => {
  try {
    const { prompt, model, keywords = [] } = req.body;
    const selectedModel = resolveSelectedModel(model);

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    if (!selectedModel) {
      return res.status(400).json({ error: "Invalid model selected" });
    }

    // Proxy to Python FastAPI service
    const { data } = await axios.post(
      `${PYTHON_URL}/forge`,
      { prompt, model: selectedModel.id, keywords },
      { timeout: 120_000 }   // 2-min timeout for long stories
    );

    // Persist to MongoDB
    const saved = await Story.create({
      prompt,
      story:      data.story,
      moral:      data.moral,
      model:      selectedModel.label,
      model_id:   selectedModel.id,
      keywords:   data.keywords,
      evaluation: data.evaluation,
      nlp:        data.nlp,
    });

    res.status(201).json({
      ...data,
      _id: saved._id,
      prompt: saved.prompt,
      model: saved.model,
      model_id: saved.model_id,
      createdAt: saved.createdAt,
      feedback: saved.feedback,
    });
  } catch (err) {
    // Forward Python service errors clearly
    if (err.response) {
      return res.status(err.response.status).json({
        error: err.response.data?.detail || "Python service error",
      });
    }
    if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
      return res.status(503).json({
        error: "Python service is unavailable at http://localhost:8000. Start the FastAPI service.",
      });
    }
    next(err);
  }
};

// ── POST /api/fable/keywords ─────────────────────────────────────────────────
exports.extractKeywords = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const { data } = await axios.post(
      `${PYTHON_URL}/nlp`,
      { text },
      { timeout: 30_000 }
    );

    res.json({ keywords: data.keywords, noun_phrases: data.entities });
  } catch (err) {
    next(err);
  }
};
