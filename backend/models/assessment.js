const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    // ADDED: Links this assessment to the skill category selected on the frontend
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: false // Optional so older assessments don't break
    },

    duration: {
        type: Number,
        required: true
    },

    totalMarks: {
        type: Number,
        required: true
    },

    passingMarks: {
        type: Number,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const assessment = mongoose.model("assessment", assessmentSchema);

module.exports = assessment;