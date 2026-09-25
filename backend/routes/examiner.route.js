const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const examinerController = require("../controllers/examiner.controller");

router.post(
    "/assessment",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    examinerController.createAssessment
);

router.get(
    "/assessment",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    examinerController.getAssessments
);

router.put(
    "/assessment/:id",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    examinerController.updateAssessment
);

router.delete(
    "/assessment/:id",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    examinerController.deleteAssessment
);

router.put(
    "/assessment/:id/publish",
    authenticateUser,
    authorizeRoles("examiner", "admin"),
    examinerController.publishAssessment
);

router.get(
    "/my",
    authenticateUser,
    authorizeRoles("examiner"),
    examinerController.getMyAssessments
);

router.get(
    "/dashboard",
    authenticateUser,
    authorizeRoles("examiner"),
    examinerController.getMyInfo
);

module.exports = router;