const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
{
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assessment",
        required: true
    },

    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    dueDate: Date,

    status: {
        type: String,
        enum: ["Assigned", "Completed"],
        default: "Assigned"
    }

},
{ timestamps: true });

module.exports = mongoose.model("assignment", assignmentSchema);