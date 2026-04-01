const Story = require("../models/Story");

// ── GET /api/stories ─────────────────────────────────────────────────────────
exports.getStories = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip  = parseInt(req.query.skip) || 0;

    const [stories, total] = await Promise.all([
      Story.find({}, "prompt story moral evaluation createdAt model model_id feedback")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Story.countDocuments(),
    ]);

    res.json({ stories, total, skip, limit });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/stories/:id ─────────────────────────────────────────────────────
exports.getStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json(story);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/stories/:id/feedback ───────────────────────────────────────────
exports.submitFeedback = async (req, res, next) => {
  try {
    const { feedback } = req.body;
    if (!["positive", "negative"].includes(feedback)) {
      return res.status(400).json({ error: "feedback must be 'positive' or 'negative'" });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { feedback },
      { new: true, select: "_id feedback" }
    );
    if (!story) return res.status(404).json({ error: "Story not found" });

    res.json({ success: true, feedback: story.feedback });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/stories/:id ───────────────────────────────────────────────────
exports.deleteStory = async (req, res, next) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
