import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Common Layout & Landing Component Imports
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage"; 

// Auth Pages (inside src/pages/auth/)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyRegistration from "./pages/auth/VerifyRegistration";

// Candidate Pages & Layout
import CandidateLayout from "./pages/candidate/CandidateLayout";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CertificateView from "./pages/candidate/CertificateView";
import MyResult from "./pages/candidate/MyResult";
import TaskAssessment from "./pages/candidate/TaskAssessment";
import Profile from "./pages/candidate/Profile";
import LiveAssessment from "./pages/candidate/LiveAssessment";

// Examiner Pages & Layout
import ExaminerLayout from "./pages/examiner/ExaminerLayout";
import ExaminerDashboard from "./pages/examiner/Dashboard";
import CreateAssessment from "./pages/examiner/CreateAssessment";
import ExaminerSubmissions from "./pages/examiner/Submissions";
import UserManagement from "./pages/examiner/UserManagement";
import ManageQuestions from "./pages/examiner/ManageQuestions";
import AssessmentList from "./pages/examiner/AssessmentList";
import EditQuestion from "./pages/examiner/EditQuestion";
import ViewResults from "./pages/examiner/ViewResult";
import SelectSkill from "./pages/examiner/SelectSkill";
import Analytics from "./pages/examiner/Analytics";
import ExaminerProfile from "./pages/examiner/Profile";

// Admin Pages & Layout
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AssignAssignment from "./pages/admin/AssignAssignment";
import AssignmentHistory from "./pages/admin/AssignmentHistory";
import PublishedAssessments from "./pages/admin/PublishedAssessments";
import RegisteredCandidates from "./pages/admin/RegisteredCandidates";
import AdminProfile from "./pages/admin/Profile";

import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC / AUTH (SHARED HEADER LAYOUT) ================= */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-registration" element={<VerifyRegistration />} />
        </Route>

        {/* ================= CANDIDATE ROUTES ================= */}
        <Route element={<ProtectedRoute roles={["candidate"]} />}>
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="assessment" element={<LiveAssessment />} />
            <Route path="assessment/:assessmentId" element={<TaskAssessment />} />
            <Route path="results" element={<MyResult />} />
            <Route path="certificate" element={<CertificateView />} />
            <Route path="verify-certificate/:certificateCode" element={<VerifyCertificate />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ================= EXAMINER ROUTES ================= */}
        <Route element={<ProtectedRoute roles={["examiner"]} />}>
          <Route path="/examiner" element={<ExaminerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ExaminerDashboard />} />
            <Route path="create-assessment" element={<SelectSkill />} />
            <Route path="create-assessment-form" element={<CreateAssessment />} />
            <Route path="assessments" element={<AssessmentList />} />
            <Route path="questions/:assessmentId" element={<ManageQuestions />} />
            <Route path="manage-questions/:assessmentId" element={<ManageQuestions />} />
            <Route path="question/edit/:id" element={<EditQuestion />} />
            <Route path="results/:id" element={<ViewResults />} />
            <Route path="submissions" element={<ExaminerSubmissions />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<ExaminerProfile />} />
          </Route>
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="assign-assignment" element={<AssignAssignment />} />
            <Route path="assignment-history" element={<AssignmentHistory />} />
            <Route path="published-assessments" element={<PublishedAssessments />} />
            <Route path="registered-candidate" element={<RegisteredCandidates />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;