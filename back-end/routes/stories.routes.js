const express = require("express");
const router  = express.Router();
const {
  getStories,
  getStory,
  submitFeedback,
  deleteStory,
} = require("../controllers/stories.controller");

// GET  /api/stories          → recent stories (paginated)
router.get("/",          getStories);

// GET  /api/stories/:id      → single story
router.get("/:id",       getStory);

// POST /api/stories/:id/feedback   → thumbs up/down
router.post("/:id/feedback", submitFeedback);

// DELETE /api/stories/:id
router.delete("/:id",    deleteStory);

module.exports = router;