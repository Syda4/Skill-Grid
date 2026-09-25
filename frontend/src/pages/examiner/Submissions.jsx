import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Submissions.css';

const mockSubmissions = [
    { id: 'SUB-101', name: 'John Doe', email: 'john@example.com', assessment: 'Python Basics', score: 92, status: 'Passed', date: 'Aug 24, 2026' },
    { id: 'SUB-102', name: 'Jane Smith', email: 'jane@example.com', assessment: 'React.js Advanced', score: 65, status: 'Failed', date: 'Aug 23, 2026' },
    { id: 'SUB-103', name: 'Alice Johnson', email: 'alice@example.com', assessment: 'Data Science', score: 88, status: 'Passed', date: 'Aug 22, 2026' },
    { id: 'SUB-104', name: 'Bob Brown', email: 'bob@example.com', assessment: 'Python Basics', score: 45, status: 'Failed', date: 'Aug 21, 2026' },
    { id: 'SUB-105', name: 'Charlie Davis', email: 'charlie@example.com', assessment: 'HTML/CSS', score: 98, status: 'Passed', date: 'Aug 20, 2026' }
];

const Submissions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All'); // 'All', 'Passed', 'Failed'

    // Filter logic
    const filteredSubmissions = mockSubmissions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              sub.assessment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' ? true : sub.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="submissions-layout">
            {/* Sidebar Navigation */}
            <nav className="sidebar">
                <img src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" alt="Logo" className="sidebar-logo" />
                
                <Link to="/examiner/dashboard" className="nav-item" title="Dashboard">
                    <i className="fas fa-home"></i>
                </Link>
                <div className="nav-item" title="User Management">
                    <i className="fas fa-users"></i>
                </div>
                <div className="nav-item active" title="Submissions & Reports">
                    <i className="fas fa-chart-line"></i>
                </div>
                <div className="spacer"></div>
                <Link to="/login" className="nav-item" title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-header">
                    <h1>Result Verification & Submissions</h1>
                    <p style={{ color: '#666', margin: 0 }}>Review candidate scores and issue certificates.</p>
                </div>

                {/* Controls Bar */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Search student or assessment..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-tabs">
                        <button 
                            className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
                            onClick={() => setFilter('All')}
                        >All</button>
                        <button 
                            className={`filter-btn ${filter === 'Passed' ? 'active' : ''}`}
                            onClick={() => setFilter('Passed')}
                        >Passed</button>
                        <button 
                            className={`filter-btn ${filter === 'Failed' ? 'active' : ''}`}
                            onClick={() => setFilter('Failed')}
                        >Failed</button>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="table-container">
                    <table className="submissions-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Assessment</th>
                                <th>Date Taken</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubmissions.map((sub) => (
                                <tr key={sub.id}>
                                    <td>
                                        <div className="candidate-cell">
                                            <div className="candidate-avatar">
                                                {sub.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="candidate-name">{sub.name}</p>
                                                <p className="candidate-email">{sub.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{sub.assessment}</td>
                                    <td>{sub.date}</td>
                                    <td style={{ fontWeight: 'bold' }}>{sub.score}%</td>
                                    <td>
                                        <span className={`status-badge ${sub.status === 'Passed' ? 'status-passed' : 'status-failed'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-btn" title="View Detailed Report">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        {sub.status === 'Passed' && (
                                            <button className="action-btn" title="View Certificate" style={{ marginLeft: '10px' }}>
                                                <i className="fas fa-certificate"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredSubmissions.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                                        No submissions found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Submissions;