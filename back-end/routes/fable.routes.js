const express = require("express");
const router  = express.Router();
const { forge, extractKeywords } = require("../controllers/fable.controller");

// POST /api/fable/forge      → full pipeline (proxied to Python service)
router.post("/forge", forge);

// POST /api/fable/keywords   → quick keyword extraction
router.post("/keywords", extractKeywords);

module.exports = router;