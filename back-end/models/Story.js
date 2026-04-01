const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    engagement:    { type: Number, default: 0 },
    coherence:     { type: Number, default: 0 },
    sentiment:     { type: Number, default: 0 },
    moral_clarity: { type: Number, default: 0 },
    overall:       { type: Number, default: 0 },
  },
  { _id: false }
);

const storySchema = new mongoose.Schema(
  {
    prompt:     { type: String, required: true, trim: true },
    story:      { type: String, required: true },
    moral:      { type: String, required: true },
    model:      { type: String, default: "LLaMA 3.3 70B - Best quality" },
    model_id:   { type: String, default: "llama-3.3-70b-versatile" },
    keywords:   [String],
    evaluation: evaluationSchema,
    nlp: {
      word_count:     Number,
      sentence_count: Number,
      keywords:       [String],
      entities:       [[String]],   // [[text, label], ...]
      vader:          mongoose.Schema.Types.Mixed,
      subjectivity:   Number,
      richness:       Number,
      readability:    Number,
      coherence:      Number,
      engagement:     Number,
    },
    feedback: {
      type:  String,
      enum:  ["positive", "negative", null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
