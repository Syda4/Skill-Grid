import API from './axiosConfig';

const assessmentService = {
    // ==========================================
    // EXAMINER / ADMIN ENDPOINTS
    // ==========================================

    // 1. Create a new assessment
    createAssessment: async (assessmentData) => {
        try {
            const response = await API.post('/assessments', assessmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to create assessment";
        }
    },

    // 2. Get all assessments (for the Examiner Dashboard)
    getAllAssessments: async () => {
        try {
            const response = await API.get('/assessments');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch assessments";
        }
    },

    // 3. Get all student submissions (for the Submissions page)
    getAllSubmissions: async () => {
        try {
            const response = await API.get('/assessments/submissions');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch submissions";
        }
    },

    // ==========================================
    // CANDIDATE ENDPOINTS
    // ==========================================

    // 4. Get active assessments available for the student to take
    getAvailableAssessments: async () => {
        try {
            const response = await API.get('/assessments/available');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch available assessments";
        }
    },

    // 5. Fetch a specific assessment to take (The Live Assessment)
    getAssessmentById: async (assessmentId) => {
        try {
            const response = await API.get(`/assessments/${assessmentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch the assessment details";
        }
    },

    // 6. Submit a completed assessment
    submitAssessment: async (assessmentId, answers) => {
        try {
            const response = await API.post(`/assessments/${assessmentId}/submit`, { answers });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to submit assessment";
        }
    },

    // 7. Get the candidate's certificates/results
    getMyResults: async () => {
        try {
            const response = await API.get('/users/me/results');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to fetch results";
        }
    }
};

export default assessmentService;