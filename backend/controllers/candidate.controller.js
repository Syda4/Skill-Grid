const Result = require('../models/result');
const User = require('../models/user');
const Assessment = require("../models/assessment");
const Assignment = require("../models/assignment");

const dashboard = async (req, res) => {

    res.status(200).json({

        success: true,

        message: "Candidate Dashboard",

        user: req.user,

    });

};

const getAvailableAssessments = async (req, res) => {

    try {

        const assignments = await Assignment.find({

            candidate: req.user.id

        })
        .populate("assessment");

        const results = await Result.find({

            candidate: req.user.id

        }).select("assessment");

        const attemptedIds = results.map(r => r.assessment.toString());

        const data = assignments.map(a => ({

            ...a.assessment.toObject(),

            attempted: attemptedIds.includes(
                a.assessment._id.toString()
            ),

            assignedOn: a.createdAt,

            dueDate: a.dueDate

        }));

        res.json({

            success:true,

            assessments:data

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// GET /candidate/certificates
const getEarnedCertificates = async (req, res) => {
  try {
    const results = await Result.find({ userid: req.user.id || req.user._id, status: "Pass" })
      .populate("testid", "title");

    const certificates = results.map((res) => ({
      _id: res._id,
      assessmentTitle: res.testid ? res.testid.title : "Skill Assessment",
      certificateCode: res.certificateCode || res.certificateld,
      issueDate: res.generatedAt || res.createdAt,
    }));

    return res.status(200).json({ success: true, certificates });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    // Search result record containing matching certificate code/ID
    const result = await Result.findOne({ certificateCode: certificateId })
      .populate('userid', 'name email')
      .populate('testid', 'title description');

    if (!result || result.status !== 'Pass') {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        certificateId: result.certificateCode,
        candidateName: result.userid ? result.userid.name : 'N/A',
        assessmentTitle: result.testid ? result.testid.title : 'N/A',
        score: result.score,
        issueDate: result.generatedAt,
        status: 'Valid'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying certificate.',
      error: error.message
    });
  }
};

module.exports = {
    dashboard,
    verifyCertificate,
    getEarnedCertificates,
    getAvailableAssessments
};