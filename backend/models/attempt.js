const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
      required: true,
    },

    selectedAnswer: {
      type: Number,
      default: -1,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assessment",
      required: true,
    },

    answers: [answerSchema],

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("attempt", attemptSchema);