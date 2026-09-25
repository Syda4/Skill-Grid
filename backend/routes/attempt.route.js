const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const attemptController = require("../controllers/attempt.controller");

router.post(
    "/start",
    authenticateUser,
    authorizeRoles("candidate"),
    attemptController.startAssessment
);

router.post(
    "/submit",
    authenticateUser,
    authorizeRoles("candidate"),
    attemptController.submitAssessment
);

router.get(
    "/result/:id",
    authenticateUser,
    authorizeRoles("candidate"),
    attemptController.getResult
);

module.exports = router;