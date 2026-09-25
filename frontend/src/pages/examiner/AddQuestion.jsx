import React, { useState } from "react";
import api from "../../services/api";
// We are reusing the CSS from the EditQuestion page since the layout is identical!
import "./css/EditQuestion.css";

function AddQuestion({ assessmentId }) {
  // Your friend's exact state structure
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: 0,
    marks: 1,
  });

  // Your friend's exact onChange handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Your friend's exact API call formatting
      await api.post("/question", {
        assessment: assessmentId,
        question: formData.question,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4,
        ],
        correctAnswer: Number(formData.correctAnswer),
        marks: Number(formData.marks),
      });

      alert("Question Added Successfully!");
      
      // QUALITY OF LIFE FIX: Clear the form so they can add another question right away!
      setFormData({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: 0,
        marks: 1,
      });

    } catch (err) {
      alert(err.response?.data?.message || "Failed to add question.");
    }
  };

  return (
    <div className="question-form-card" style={{ marginTop: '0', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Add New Question</h3>
      
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Question Text</label>
          <textarea
            className="form-control"
            name="question"
            placeholder="Type the question here..."
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>

        <label style={{ display: 'block', marginBottom: '10px', color: '#334155', fontWeight: '600' }}>
          Answer Options
        </label>
        
        <div className="options-grid">
          <div className="form-group">
            <input className="form-control" name="option1" placeholder="Option 1" value={formData.option1} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input className="form-control" name="option2" placeholder="Option 2" value={formData.option2} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input className="form-control" name="option3" placeholder="Option 3" value={formData.option3} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input className="form-control" name="option4" placeholder="Option 4" value={formData.option4} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Correct Answer</label>
            <select 
              className="form-control" 
              name="correctAnswer" 
              value={formData.correctAnswer} 
              onChange={handleChange}
            >
              {/* Your friend's logic maps the correct answer to the array index (0, 1, 2, 3) */}
              <option value="0">Option 1</option>
              <option value="1">Option 2</option>
              <option value="2">Option 3</option>
              <option value="3">Option 4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Marks</label>
            <input 
              className="form-control" 
              type="number" 
              name="marks" 
              value={formData.marks} 
              onChange={handleChange} 
              min="1"
              required 
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" style={{ backgroundColor: '#10b981' }}>
          <i className="fas fa-plus"></i> Save Question
        </button>

      </form>
    </div>
  );
}

export default AddQuestion;