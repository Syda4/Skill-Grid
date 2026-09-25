const Question = require("../models/question");
const Result = require("../models/result");
const Assessment = require("../models/assessment");

const addQuestion = async (req, res) => {
    try {
        const {
            assessment,
            skillId,
            question,
            options,
            correctAnswer,
            marks,
            difficulty
        } = req.body;

        if (
            !assessment ||
            !skillId ||
            !question ||
            !options ||
            options.length !== 4
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            });
        }

        const newQuestion = await Question.create({
            assessment,
            skillId,
            question,
            options,
            correctAnswer,
            marks,
            difficulty
        });

        return res.status(201).json({
            success: true,
            message: "Question Added",
            question: newQuestion
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getQuestions = async (req, res) => {
    try {
        const alreadySubmitted = await Result.findOne({
            candidate: req.user.id,
            assessment: req.params.id,
        });

        if (alreadySubmitted) {
            return res.status(400).json({
                success: false,
                message: "You have already completed this assessment.",
            });
        }

        const assessment = await Assessment.findById(req.params.id);

if (!assessment) {
    return res.status(404).json({
        success: false,
        message: "Assessment not found",
    });
}

const questions = await Question.find({
    assessment: req.params.id,
});

return res.json({
    success: true,
    questions,
    duration: assessment.duration,
});
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// NEW — this was missing, and is what powers the "Select from Bank" tab
const getBankQuestionsBySkill = async (req, res) => {
    try {
        const { skillId } = req.params;

        if (!skillId) {
            return res.status(400).json({
                success: false,
                message: "skillId is required"
            });
        }

        const questions = await Question.find({ skillId });

        return res.json({
            success: true,
            questions
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deleteQuestion = async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: "Deleted"
    });
};

const updateQuestion = async (req, res) => {
    try {
        const {
            question,
            options,
            correctAnswer,
            marks,
            difficulty
        } = req.body;

        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            {
                question,
                options,
                correctAnswer,
                marks,
                difficulty
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Question Updated",
            question: updated
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    addQuestion,
    getQuestions,
    deleteQuestion,
    updateQuestion,
    getBankQuestionsBySkill
};