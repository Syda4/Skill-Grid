import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/EmailVerification.css';

const EmailVerification = () => {
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const userEmail = "student@example.com"; 

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting verification code:", code);
        setIsVerified(true);
    };

    const handleResend = () => {
        console.log("Resending verification code to:", userEmail);
        alert("A new code has been sent to your email.");
    };

    return (
        <div className="verification-page">
            <div className="main-container">
                <div className="form-box">
                    <div className="icon-wrapper">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/2664/2664679.png" 
                            alt="Email Icon" 
                            className="email-icon" 
                        />
                    </div>
                    
                    <h2>Verify Your Email</h2>
                    
                    {isVerified ? (
                        <div className="verification-success">
                            <div className="success-message">
                                <strong>Success!</strong><br />
                                Your email has been successfully verified. You can now access your dashboard.
                            </div>
                            <Link to="/login">
                                <button className="action-btn">Go to Login</button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="subtitle">
                                We've sent a 6-digit verification code to <span className="highlight-email">{userEmail}</span>. Please enter it below to confirm your account.
                            </p>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="code-input-group input-group">
                                    <input 
                                        type="text" 
                                        name="code" 
                                        placeholder="••••••" 
                                        maxLength="6"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        className="otp-input"
                                        required 
                                    />
                                </div>
                                <button type="submit" className="action-btn">Verify Account</button>
                            </form>

                            <div className="resend-link">
                                Didn't receive the code? 
                                <button type="button" onClick={handleResend}>Resend</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;