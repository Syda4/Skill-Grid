const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const resultController = require("../controllers/result.controller");

router.post(
  "/",
  authenticateUser,
  authorizeRoles("candidate"),
  resultController.submitResult
);

router.get(
    "/my-results",
    authenticateUser,
    authorizeRoles("candidate"),
    resultController.getMyResults
);

module.exports = router;