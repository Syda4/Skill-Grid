const express = require("express");
const router = express.Router();

// Import your auth middleware so only logged-in users can see analytics
// (Make sure this path matches your actual auth middleware file)
const authenticateUser = require("../middlewares/auth.middleware"); 
const reportController = require("../controllers/report.controller");

// 1. Dashboard JSON data endpoint
// Final URL: GET /analytics/dashboard
router.get(
    "/dashboard",
    authenticateUser,
    reportController.getAnalyticsDashboard
);

// 2. PDF Export endpoint (ADDED THIS)
// Final URL: GET /analytics/export/pdf
router.get(
    "/export/pdf",
    authenticateUser,
    reportController.exportAnalyticsPDF
);

module.exports = router;