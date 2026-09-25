const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const adminController = require("../controllers/admin.controller");

router.get(

    "/candidates",

    authenticateUser,

    authorizeRoles("admin"),

    adminController.getCandidates

);

router.get(

    "/assessments",

    authenticateUser,

    authorizeRoles("admin"),

    adminController.getPublishedAssessments

);

router.get(

    "/assignments",

    authenticateUser,

    authorizeRoles("admin"),

    adminController.getAssignments

);

router.post(

    "/assign",

    authenticateUser,

    authorizeRoles("admin"),

    adminController.assignAssessment

);

module.exports = router;