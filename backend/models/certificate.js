const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateCode: {
      type: String,
      unique: true,
      required: true,
    },

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

    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "result",
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Valid", "Revoked"],
      default: "Valid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("certificate", certificateSchema);