const express = require("express");

const router = express.Router();

const authenticateUser = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const controller = require("../controllers/certificate.controller");

router.get(
    "/my",
    authenticateUser,
    authorizeRoles("candidate"),
    controller.getMyCertificates
);

router.get(
    "/verify/:code",
    controller.verifyCertificate
);

module.exports = router;