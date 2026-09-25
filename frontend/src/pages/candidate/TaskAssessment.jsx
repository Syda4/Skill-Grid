import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./css/Dashboard.css";

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = sessionStorage.getItem("examAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    return Number(sessionStorage.getItem("currentQuestion") || 0);
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 30 Minutes Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    sessionStorage.setItem("currentQuestion", currentQuestion);
  }, [currentQuestion]);

  useEffect(() => {
    sessionStorage.setItem("examAnswers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (sessionStorage.getItem("examInProgress")) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("examInProgress", "true");
    sessionStorage.setItem("currentAssessmentId", assessmentId);

    return () => {
      sessionStorage.removeItem("examInProgress");
      sessionStorage.removeItem("currentAssessmentId");
    };
  }, []);

  useEffect(() => {
    const handleSubmitEvent = () => {
      submitExam(true);
    };

    window.addEventListener("submitExam", handleSubmitEvent);

    return () => {
      window.removeEventListener("submitExam", handleSubmitEvent);
    };
  }, []);

  useEffect(() => {
    // Push current page into history
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const confirmSubmit = window.confirm(
        "Your assessment is in progress.\n\nDo you want to submit the exam before leaving?",
      );

      if (confirmSubmit) {
        submitExam(true);
      } else {
        // Stay on the page
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      const endTime = Number(sessionStorage.getItem("examEndTime"));

      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        submitExam(true);
        return;
      }

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/question/assessment/${assessmentId}`,
        {
          withCredentials: true,
        },
      );

      setQuestions(res.data.questions || []);

      const duration = res.data.duration || 30;

      const savedEndTime = sessionStorage.getItem("examEndTime");

      if (!savedEndTime) {
        const endTime = Date.now() + duration * 60 * 1000;

        sessionStorage.setItem("examEndTime", endTime);
        setTimeLeft(duration * 60);
      } else {
        const remaining = Math.floor(
          (Number(savedEndTime) - Date.now()) / 1000,
        );

        setTimeLeft(Math.max(remaining, 0));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // SAVE INDEX (0, 1, 2, 3) TO MATCH DATABASE `correctAnswer` NUMBER FIELD
  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: Number(optionIndex),
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitExam = async (autoSubmit = false) => {
    if (submittedRef.current) return;

    submittedRef.current = true;

    if (!autoSubmit) {
      const ok = window.confirm("Are you sure you want to submit?");
      if (!ok) {
        submittedRef.current = false;
        return;
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:8081/result",
        {
          assessment: assessmentId,
          answers,
        },
        {
          withCredentials: true,
        },
      );

      alert(res.data.message || "Assessment Submitted!");

      const redirect =
        sessionStorage.getItem("redirectAfterSubmit") || "/candidate/dashboard";

      // Cleanup
      sessionStorage.removeItem("redirectAfterSubmit");
      sessionStorage.removeItem("examInProgress");
      sessionStorage.removeItem("currentAssessmentId");
      sessionStorage.removeItem("examEndTime");
      sessionStorage.removeItem("examAnswers");
      sessionStorage.removeItem("currentQuestion");

      navigate(redirect, { replace: true });
    } catch (err) {
      submittedRef.current = false;
      alert(err.response?.data?.message || err.message);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <div className="spinner-border text-cyan" role="status"></div>
        <span className="ms-3 fw-semibold fs-5">Loading Questions...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-light">
        <i className="fas fa-exclamation-triangle text-warning fs-1 mb-3"></i>
        <h2 className="fw-bold">No Questions Found</h2>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="profile-dashboard-wrapper p-4 text-white min-vh-100">
      {/* Top Banner Header */}
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h1 className="fw-bold fs-2 m-0 text-white d-flex align-items-center gap-2">
            <span>
              Online <span className="theme-gradient-text">Assessment</span>
            </span>
            <span className="fs-3">📝</span>
          </h1>
          <p className="subtext-gray m-0 mt-1 fs-6">
            Complete all questions before time runs out.
          </p>
        </div>

        {/* Cyber Countdown Badge */}
        <div className="cyber-timer-pill">
          <i className="far fa-clock me-2"></i>
          <span>{formatTime()}</span>
        </div>
      </header>

      {/* Main Examination Layout */}
      <div className="row g-4">
        {/* Question Palette Sidebar */}
        <div className="col-lg-3 col-md-4">
          <div className="cyber-card p-3 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                <h5 className="fw-bold text-white m-0 fs-6 text-uppercase tracking-wider">
                  Question Palette
                </h5>
                <span className="info-chip fs-7">
                  {Object.keys(answers).length}/{questions.length} Answered
                </span>
              </div>

              {/* Grid of Question Circles */}
              <div className="d-flex flex-wrap gap-2 justify-content-start">
                {questions.map((q, index) => {
                  const isCurrent = currentQuestion === index;
                  const isAnswered = answers[q._id] !== undefined;

                  return (
                    <button
                      key={q._id}
                      className={`palette-num-btn ${
                        isCurrent
                          ? "palette-current"
                          : isAnswered
                            ? "palette-answered"
                            : "palette-unanswered"
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend Section */}
            <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex align-items-center gap-2">
                  <span className="legend-dot bg-cyan"></span>
                  <span className="subtext-gray">Current Question</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="legend-dot bg-green"></span>
                  <span className="subtext-gray">Answered</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="legend-dot bg-gray"></span>
                  <span className="subtext-gray">Not Attempted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content View */}
        <div className="col-lg-9 col-md-8">
          <div className="cyber-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              {/* Question Number Badge */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="question-counter-badge">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="fw-bold text-white mb-4 fs-4 leading-relaxed">
                {question.question}
              </h3>

              {/* Options Grid */}
              <div className="d-flex flex-column gap-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[question._id] === index;

                  return (
                    <label
                      key={index}
                      className={`option-row-card p-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer ${
                        isSelected ? "option-selected" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        className="form-check-input flex-shrink-0 theme-radio"
                        type="radio"
                        name={question._id}
                        value={index}
                        checked={isSelected}
                        onChange={() => handleAnswer(question._id, index)}
                      />
                      <span className="option-text fs-6 fw-medium text-white">
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top border-secondary border-opacity-25">
              <button
                className="cyber-btn secondary-glow"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                <i className="fas fa-arrow-left me-2"></i> Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  className="cyber-btn success-glow"
                  onClick={() => submitExam(false)}
                >
                  Submit Exam <i className="fas fa-check-circle ms-2"></i>
                </button>
              ) : (
                <button
                  className="cyber-btn primary-glow"
                  onClick={nextQuestion}
                >
                  Next <i className="fas fa-arrow-right ms-2"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAssessment;
