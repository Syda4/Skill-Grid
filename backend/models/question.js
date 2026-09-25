const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    // Made optional (required: false) so questions can live freely in the 
    // Question Bank without having to be attached to a specific test yet.
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assessment",
        required: false 
    },

    // ADDED: Links the question to a specific subject (e.g., Data Structures)
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true
    },

    question: {
        type: String,
        required: true
    },

    // ADDED: Categorizes difficulty so examiners can filter by it
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },

    options: [{
        type: String
    }],

    correctAnswer: {
        type: Number,
        required: true
    },

    marks: {
        type: Number,
        default: 1
    }

}, { timestamps: true });

const question = mongoose.model("question", questionSchema);

module.exports = question;