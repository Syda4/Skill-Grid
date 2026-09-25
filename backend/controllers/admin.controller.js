const Assignment = require("../models/assignment");
const Assessment = require("../models/assessment");
const User = require("../models/user");

const getCandidates = async (req, res) => {

    try {

        const candidates = await User.find({

            role: "candidate"

        }).select("name email");

        res.json({

            success:true,

            candidates

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

const getPublishedAssessments = async(req,res)=>{

    try{

        const assessments=await Assessment.find({

            isPublished:true

        });

        res.json({

            success:true,

            assessments

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

const assignAssessment = async(req,res)=>{

    try{

        const {

            assessmentId,

            candidateId,

            dueDate

        } = req.body;

        const exists = await Assignment.findOne({

            assessment:assessmentId,

            candidate:candidateId

        });

        if(exists){

            return res.status(400).json({

                success:false,

                message:"Already Assigned"

            });

        }

        const assignment = await Assignment.create({

            assessment:assessmentId,

            candidate:candidateId,

            assignedBy:req.user.id,

            dueDate

        });

        res.status(201).json({

            success:true,

            message:"Assessment Assigned",

            assignment

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

const getAssignments = async(req,res)=>{

    try{

        const assignments = await Assignment.find()

        .populate("candidate","name email")

        .populate("assessment","title");

        res.json({

            success:true,

            assignments

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

module.exports = {

    getCandidates,

    getPublishedAssessments,

    assignAssessment,

    getAssignments

};