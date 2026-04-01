require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const morgan     = require("morgan");

const fableRoutes   = require("./routes/fable.routes");
const storiesRoutes = require("./routes/stories.routes");
const errorHandler  = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/fable",   fableRoutes);
app.use("/api/stories", storiesRoutes);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "fableforge-node" })
);

// ── Error handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ── DB + listen ─────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/FableForge")
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () => console.log(`🚀  Express server on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌  MongoDB error:", err.message);
    process.exit(1);
  });
