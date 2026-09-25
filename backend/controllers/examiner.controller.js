const Assessment = require("../models/assessment");
const User= require("../models/user");
const Question= require("../models/question");
const Certificate= require("../models/certificate");

const createAssessment = async (req, res) => {

    try {

        const {

            title,

            description,

            duration,

            totalMarks,

            passingMarks,

            skillId

        } = req.body;

        const assessment = await Assessment.create({

            title,

            description,

            duration,

            totalMarks,

            passingMarks,

            skillId,

            createdBy: req.user.id

        });

        res.status(201).json({

            success: true,

            message: "Assessment Created",

            assessment

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const getAssessments = async (req, res) => {

    try {

        const assessments = await Assessment.find({

            createdBy: req.user.id

        }).sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            assessments

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const updateAssessment = async (req, res) => {

    try {

        const assessment = await Assessment.findOneAndUpdate(

            {

                _id: req.params.id,

                createdBy: req.user.id

            },

            req.body,

            {

                new: true

            }

        );

        if (!assessment) {

            return res.status(404).json({

                success: false,

                message: "Assessment Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Assessment Updated",

            assessment

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const deleteAssessment = async (req, res) => {

    try {

        const assessment = await Assessment.findOneAndDelete({

            _id: req.params.id,

            createdBy: req.user.id

        });

        if (!assessment) {

            return res.status(404).json({

                success: false,

                message: "Assessment Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Assessment Deleted"

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const publishAssessment = async (req, res) => {

    try {

        const assessment = await Assessment.findOneAndUpdate(

            {

                _id: req.params.id,

                createdBy: req.user.id

            },

            {

                isPublished: true

            },

            {

                new: true

            }

        );

        if (!assessment) {

            return res.status(404).json({

                success: false,

                message: "Assessment Not Found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Assessment Published",

            assessment

        });

    }

    catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const getMyAssessments = async (req, res) => {
    try {

        const assessments = await Assessment.find({
            createdBy: req.user.id
        });

        res.json({
            success: true,
            assessments
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

const getMyInfo=async(req,res)=>{
    try{
        const students= await User.countDocuments({role:"candidate"});
        const assessments= await Assessment.countDocuments();
        const questions= await Question.countDocuments();
        const certificates=await Certificate.countDocuments();
        const stats={
            students,
            assessments,
            questions,
            certificates
        };
        res.status(200).json({
            success:true,
            message:"Examiner Dashboard",
            user:req.user,
            stats
        });
    }catch(err){

    }
};

module.exports = {

    createAssessment,
    getAssessments,

    updateAssessment,

    deleteAssessment,

    publishAssessment,
    getMyAssessments,
    getMyInfo

};