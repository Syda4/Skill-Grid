import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// 1. IMPORT AUTHENTICATION PAGES
// ==========================================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailVerification from "./pages/auth/EmailVerification";

// ==========================================
// 2. IMPORT CANDIDATE (STUDENT) PAGES
// ==========================================
import CandidateDashboard from "./pages/candidate/Dashboard";
import LiveAssessment from "./pages/candidate/LiveAssessment";
import CertificateView from "./pages/candidate/CertificateView";

// ==========================================
// 3. IMPORT EXAMINER (ADMIN) PAGES
// ==========================================
import ExaminerDashboard from "./pages/examiner/Dashboard";
import CreateAssessment from "./pages/examiner/CreateAssessment";
import Submissions from "./pages/examiner/Submissions";
import UserManagement from "./pages/examiner/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route: Redirects to Login when visiting localhost:5173/ */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ------------------------------------------ */}
        {/* AUTHENTICATION ROUTES                      */}
        {/* ------------------------------------------ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ------------------------------------------ */}
        {/* CANDIDATE ROUTES                           */}
        {/* ------------------------------------------ */}
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/assessment" element={<LiveAssessment />} />
        <Route path="/candidate/certificate" element={<CertificateView />} />

        {/* ------------------------------------------ */}
        {/* EXAMINER ROUTES                            */}
        {/* ------------------------------------------ */}
        <Route path="/examiner/dashboard" element={<ExaminerDashboard />} />
        <Route
          path="/examiner/create-assessment"
          element={<CreateAssessment />}
        />
        <Route path="/examiner/submissions" element={<Submissions />} />
        <Route path="/examiner/users" element={<UserManagement />} />

        {/* ------------------------------------------ */}
        {/* FALLBACK ROUTE                             */}
        {/* ------------------------------------------ */}
        {/* If a user types a URL that doesn't exist (like /abcd), send them back to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
