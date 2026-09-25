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
    default:-1,
}
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
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

    percentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pass", "Fail"],
      default: "Fail",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("result", resultSchema);