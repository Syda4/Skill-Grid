const Attempt = require("../models/attempt");
const Assessment = require("../models/assessment");
const Question = require("../models/question");


// Candidate clicks Start Exam
const startAssessment = async (req, res) => {

    try {

        const { assessmentId } = req.body;

        const assessment = await Assessment.findById(assessmentId);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found"
            });
        }

        const questions = await Question.find({
            assessment: assessmentId
        }).select("-correctAnswer");

        return res.json({

            success: true,

            assessment,

            questions

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};




// Candidate submits exam
const submitAssessment = async (req, res) => {

    try {

        const {

            assessmentId,

            answers

        } = req.body;

        let score = 0;

        let totalMarks = 0;

        let finalAnswers = [];

        for (const ans of answers) {

            const question = await Question.findById(ans.question);

            totalMarks += question.marks;

            const isCorrect =
                Number(ans.selectedAnswer) ===
                Number(question.correctAnswer);

            if (isCorrect) {

                score += question.marks;

            }

            finalAnswers.push({

                question: question._id,

                selectedAnswer: ans.selectedAnswer,

                isCorrect

            });

        }

        const attempt = await Attempt.create({

            candidate: req.user.id,

            assessment: assessmentId,

            answers: finalAnswers,

            score,

            totalMarks

        });

        return res.json({

            success: true,

            message: "Assessment Submitted",

            attempt

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};




// View Result
const getResult = async (req, res) => {

    try {

        const attempt = await Attempt.findById(req.params.id)

            .populate("assessment")

            .populate("candidate");

        if (!attempt) {

            return res.status(404).json({

                success: false,

                message: "Result not found"

            });

        }

        return res.json({

            success: true,

            attempt

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    startAssessment,

    submitAssessment,

    getResult

};