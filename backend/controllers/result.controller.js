const Result = require("../models/result");
const Question = require("../models/question");
const Certificate = require("../models/certificate");
const { v4: uuid } = require("uuid");

const submitResult = async (req, res) => {
  try {
    const { assessment, answers } = req.body;

    const candidate = req.user.id;

    if (!assessment || !answers) {
      return res.status(400).json({
        success: false,
        message: "Assessment and answers required",
      });
    }

    const questions = await Question.find({
      assessment,
    });

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "Questions not found",
      });
    }

    let score = 0;
    let totalMarks = 0;

    const answerArray = [];

    questions.forEach((q) => {
      totalMarks += q.marks;

      const selected = answers[q._id];

answerArray.push({
  question: q._id,
  selectedAnswer:
    selected !== undefined ? Number(selected) : -1,
});

if (Number(selected) === Number(q.correctAnswer)) {
  score += q.marks;
}
    });

    const percentage = Number(
      ((score / totalMarks) * 100).toFixed(2)
    );

    const status = percentage >= 40 ? "Pass" : "Fail";

    const result = await Result.create({
      candidate,
      assessment,
      answers: answerArray,
      score,
      totalMarks,
      percentage,
      status,
    });
    if (status === "Pass") {

    await Certificate.create({

        certificateCode: uuid(),

        candidate,

        assessment,

        result: result._id

    });

}

    return res.status(201).json({
      success: true,
      message: "Assessment Submitted Successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMyResults = async (req, res) => {
    try {

        const results = await Result.find({

            candidate: req.user.id

        })

        .populate("assessment", "title duration totalMarks")

        .sort({ createdAt: -1 });

        return res.json({

            success: true,

            results

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
  submitResult,
  getMyResults,
};