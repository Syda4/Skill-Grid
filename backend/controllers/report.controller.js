const Assessment = require("../models/assessment");
const User = require("../models/user");
const Attempt = require("../models/result"); // Your result / attempt model
const Certificate = require("../models/certificate");
const PDFDocument = require("pdfkit");

// --- Shared builder used by both the JSON dashboard endpoint and the PDF export ---
async function buildAnalyticsData(query) {
    const { startDate, endDate, skillId, assessmentId } = query || {};

    // --- 1. FILTERING LOGIC ---
    let attemptQuery = {};

    if (startDate || endDate) {
        attemptQuery.createdAt = {};
        if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) attemptQuery.createdAt.$gte = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) {
                end.setHours(23, 59, 59, 999);
                attemptQuery.createdAt.$lte = end;
            }
        }
    }

    if (assessmentId) {
        attemptQuery.assessment = assessmentId;
    }

    // --- 2. KPI CALCULATIONS ---
    const totalAssessments = (await Assessment.countDocuments().catch(() => 0)) || 0;
    const totalCandidates = (await User.countDocuments({ role: "candidate" }).catch(() => 0)) || 0;
    const certificatesIssued = (await Certificate.countDocuments().catch(() => 0)) || 0;

    // --- 3. FETCH ATTEMPTS WITH CORRECT POPULATE ---
    let allAttempts = [];
    try {
        allAttempts = await Attempt.find(attemptQuery)
            .populate("candidate", "name email")
            .populate({
                path: "assessment",
                select: "title passingMarks skillId",
                populate: {
                    path: "skillId",
                    select: "name",
                    options: { strictPopulate: false }
                },
                options: { strictPopulate: false }
            })
            .sort({ createdAt: -1 })
            .lean();
    } catch (err) {
        console.error("MongoDB Attempt Fetch Error:", err);
        allAttempts = [];
    }

    let passedCount = 0;
    let performanceData = [];

    (allAttempts || []).forEach(attempt => {
        if (!attempt) return;

        const assessmentObj = attempt.assessment || {};
        const skillObj = assessmentObj.skillId || {};

        // Apply skill filter if requested
        if (skillId) {
            const currentSkillId = skillObj._id ? skillObj._id.toString() : String(skillObj);
            if (currentSkillId !== String(skillId)) return;
        }

        // Determine result (Pass / Fail)
        const status = attempt.status || attempt.result;
        let isPass = status === "Pass";

        if (!status && assessmentObj.passingMarks !== undefined) {
            isPass = (attempt.score || 0) >= assessmentObj.passingMarks;
        } else if (!status) {
            isPass = (attempt.score || 0) > 0;
        }

        if (isPass) passedCount++;

        const candidateObj = attempt.candidate;
        const candidateName = typeof candidateObj === "object" ? candidateObj?.name : "Candidate";

        performanceData.push({
            _id: attempt._id,
            candidateName: candidateName || "Candidate",
            assessmentTitle: assessmentObj.title || "Assessment",
            category: skillObj.name || "General",
            score: Number(attempt.score) || 0,
            result: isPass ? "Pass" : (status || "Fail"),
            date: attempt.submittedAt || attempt.createdAt || new Date()
        });
    });

    const passRate = performanceData.length > 0
        ? Math.round((passedCount / performanceData.length) * 100)
        : 0;

    return {
        stats: { totalAssessments, totalCandidates, passRate, certificatesIssued },
        performanceData
    };
}

exports.getAnalyticsDashboard = async (req, res) => {
    try {
        const data = await buildAnalyticsData(req.query);
        res.status(200).json(data);
    } catch (error) {
        console.error("Analytics Error Stack Trace:", error);
        res.status(500).json({ message: "Failed to load analytics data.", error: error.message });
    }
};

exports.exportAnalyticsPDF = async (req, res) => {
    try {
        // Fetch data FIRST before setting up PDF headers/pipe
        const { stats, performanceData } = await buildAnalyticsData(req.query);

        const doc = new PDFDocument({ margin: 40 });

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Assessment_Analytics_Report.pdf");

        // Pipe PDF document to HTTP response
        doc.pipe(res);

        // Header Section
        doc.fontSize(18).text("Assessment Analytics Report", { align: "center" });
        doc.moveDown();

        // Key Statistics
        doc.fontSize(12).text(`Total Assessments: ${stats?.totalAssessments || 0}`);
        doc.text(`Total Candidates: ${stats?.totalCandidates || 0}`);
        doc.text(`Average Pass Rate: ${stats?.passRate || 0}%`);
        doc.text(`Certificates Issued: ${stats?.certificatesIssued || 0}`);
        doc.moveDown();

        // Performance Summary Section
        doc.fontSize(14).text("Performance Summary", { underline: true });
        doc.moveDown(0.5);

        if (!performanceData || performanceData.length === 0) {
            doc.fontSize(10).text("No records match the selected filters.");
        } else {
            performanceData.forEach(row => {
                const candidate = row.candidateName || "Candidate";
                const title = row.assessmentTitle || "Assessment";
                const category = row.category || "General";
                const score = row.score !== undefined ? row.score : 0;
                const result = row.result || "N/A";

                let formattedDate = "N/A";
                if (row.date) {
                    const parsed = new Date(row.date);
                    formattedDate = !isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : "N/A";
                }

                doc.fontSize(10).text(
                    `${candidate} | ${title} | ${category} | Score: ${score} | ${result} | ${formattedDate}`
                );
            });
        }

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error("PDF Export Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate PDF report.", error: error.message });
        }
    }
};