const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const candidateController = require("../controllers/candidate.controller");

// Protected Candidate Routes
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("candidate"),
  candidateController.dashboard
);

router.get(
  "/assessments",
  authenticateUser,
  authorizeRoles("candidate"),
  candidateController.getAvailableAssessments
);

router.get(
  "/certificates",
  authenticateUser,
  authorizeRoles("candidate"),
  candidateController.getEarnedCertificates
);

// PUBLIC Verification Route (Per SRS FR-7.1 - No Authentication)
router.get(
  "/verify-certificate/:certificateId",
  candidateController.verifyCertificate
);

module.exports = router;