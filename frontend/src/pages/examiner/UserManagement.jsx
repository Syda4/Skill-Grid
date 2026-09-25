import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/UserManagement.css';

const mockUsers = [
    { id: 'USR-001', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'Active', joined: 'Aug 10, 2026' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane.smith@university.edu', role: 'examiner', status: 'Active', joined: 'Aug 05, 2026' },
    { id: 'USR-003', name: 'Admin User', email: 'admin@ujwalradiant.com', role: 'admin', status: 'Active', joined: 'Jul 01, 2026' },
    { id: 'USR-004', name: 'Bob Brown', email: 'bob@example.com', role: 'student', status: 'Suspended', joined: 'Aug 20, 2026' },
    { id: 'USR-005', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'examiner', status: 'Pending', joined: 'Aug 25, 2026' }
];

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All'); 

    // Filter logic
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' ? true : user.role === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeClass = (role) => {
        switch(role) {
            case 'student': return 'role-student';
            case 'examiner': return 'role-examiner';
            case 'admin': return 'role-admin';
            default: return '';
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Active': return 'status-active';
            case 'Suspended': return 'status-suspended';
            case 'Pending': return 'status-pending';
            default: return '';
        }
    };

    return (
        <div className="users-layout">
            {/* Sidebar Navigation (Reused standard sidebar) */}
            <nav className="sidebar">
                <img src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" alt="Logo" className="sidebar-logo" />
                
                <Link to="/examiner/dashboard" className="nav-item" title="Dashboard">
                    <i className="fas fa-home"></i>
                </Link>
                <div className="nav-item active" title="User Management">
                    <i className="fas fa-users"></i>
                </div>
                <Link to="/examiner/submissions" className="nav-item" title="Submissions & Reports">
                    <i className="fas fa-chart-line"></i>
                </Link>
                <div className="spacer"></div>
                <Link to="/login" className="nav-item" title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>User Management</h1>
                        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Manage candidates, examiners, and system administrators.</p>
                    </div>
                    <button className="btn-add-user">
                        <i className="fas fa-plus"></i> Add New User
                    </button>
                </div>

                {/* Controls Bar */}
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-tabs">
                        {['All', 'Student', 'Examiner', 'Admin'].map(tab => (
                            <button 
                                key={tab}
                                className={`filter-btn ${roleFilter === tab ? 'active' : ''}`}
                                onClick={() => setRoleFilter(tab)}
                            >
                                {tab}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Users Table */}
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Date Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="user-name">{user.name}</p>
                                                <p className="user-email">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={getStatusClass(user.status)}>
                                            <i className="fas fa-circle" style={{ fontSize: '0.6em', marginRight: '5px', verticalAlign: 'middle' }}></i>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.joined}</td>
                                    <td>
                                        <button className="action-btn" title="Edit User">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn delete" title="Suspend/Delete" style={{ marginLeft: '10px' }}>
                                            <i className="fas fa-ban"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                                        No users found matching your search criteria.
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

export default UserManagement;