const User = require("../models/user");
const OTP = require("../models/otp");
const { hashPassword, comparePassword } = require("../utils/hash");
const generateToken = require("../utils/jwt");
const sendEmail = require("../services/email.service");
const crypto = require("crypto");

const signup = async (req, res) => {
    try {
        const { fullname, email, phone, password, confirmPassword, roles } = req.body;

        if (!fullname || !email ||!phone || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if(phone.length<10){
            return res.status(400).json({ success: false, message: "Phone number should be in 10 digit" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must contain at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name: fullname,
            email,
            phone_no:phone,
            password: hashedPassword,
            role: roles || "candidate"
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ email });
        await OTP.create({
            email,
            otp,
            expireAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail(
            email,
            "Verify Your Email",
            `<h2>Email Verification</h2><p>Your OTP is</p><h1>${otp}</h1><p>Expires in 5 minutes.</p>`
        );

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,       
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        await sendEmail(
            user.email,
            "Welcome to Ujwal Radiant Vision",
            `<h2>Welcome ${user.name}</h2>
            <p>Your account has been created successfully.</p>
            <p>You can now login and access the <b>Online Skill Assessment and Digital Certification Platform</b>.</p>
            <br><p>Regards,</p><h3>Ujwal Radiant Vision Team</h3>`
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({ success: true, message: "OTP sent to your email" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // --- AC-02: Check if the account is currently locked ---
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const remainingMins = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
            return res.status(403).json({
                success: false,
                message: `Account locked due to too many failed attempts. Try again in ${remainingMins} minutes.`,
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified",
                email: user.email,
                verificationRequired: true,
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            // --- AC-02: Increment failed attempts (safely fallback to 0 if undefined) ---
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            // If attempts hit 5, lock the account for 30 minutes
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes from now
                await user.save();
                return res.status(403).json({
                    success: false,
                    message: "Account locked due to 5 failed login attempts. Try again in 30 minutes.",
                });
            }

            await user.save();
            return res.status(401).json({
                success: false,
                message: `Invalid Credentials. ${5 - user.loginAttempts} attempts remaining.`,
            });
        }

        // --- AC-02: Reset attempts and lock timer on SUCCESSFUL login ---
        if (user.loginAttempts > 0 || user.lockUntil) {
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,          
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            user: userResponse,
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.deleteMany({ email });
        await OTP.create({ email, otp, expireAt: new Date(Date.now() + 5 * 60 * 1000) });

        await sendEmail(
            email,
            "Password Reset OTP",
            `<h2>Password Reset</h2><p>Your OTP is</p><h1>${otp}</h1><p>OTP expires in 5 minutes.</p>`
        );

        return res.status(200).json({ success: true, message: "OTP Sent Successfully" });
    } catch(err){
        return res.status(500).json({ success:false, message:err.message });
    }
};

const verifyOTP = async (req,res)=>{
    try{
        const {email,otp}=req.body;
        if(!email || !otp) return res.status(400).json({ success:false, message:"Email and OTP required" });

        const data=await OTP.findOne({email,otp});
        if(!data) return res.status(400).json({ success:false, message:"Invalid OTP" });

        if(data.expireAt < new Date()){
            await OTP.deleteOne({_id:data._id});
            return res.status(400).json({ success:false, message:"OTP Expired" });
        }

        return res.status(200).json({ success:true, message:"OTP Verified" });
    } catch(err){
        res.status(500).json({ success:false, message:err.message });
    }
};

const resetPassword = async(req,res)=>{
    try{
        const { email, otp, password, confirmPassword }=req.body;
        if(!email || !otp || !password || !confirmPassword) return res.status(400).json({ success:false, message:"All fields required" });
        if(password!==confirmPassword) return res.status(400).json({ success:false, message:"Passwords do not match" });

        const otpData=await OTP.findOne({email,otp});
        if(!otpData) return res.status(400).json({ success:false, message:"Invalid OTP" });

        if(otpData.expireAt < new Date()) return res.status(400).json({ success:false, message:"OTP Expired" });

        const hashedPassword=await hashPassword(password);
        await User.findOneAndUpdate({email}, {password:hashedPassword});
        await OTP.deleteOne({_id:otpData._id});

        return res.status(200).json({ success:true, message:"Password Changed Successfully" });
    } catch(err){
        res.status(500).json({ success:false, message:err.message });
    }
};

const logout = (req,res)=>{
    res.clearCookie("token");
    return res.status(200).json({ success:true, message:"Logout Successful" });
};

const me = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
};

const verifyRegistration = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData = await OTP.findOne({ email, otp });

        if (!otpData) return res.status(400).json({ success: false, message: "Invalid OTP" });

        if (otpData.expireAt < new Date()) {
            await OTP.deleteOne({ _id: otpData._id });
            return res.status(400).json({ success: false, message: "OTP Expired" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.isVerified = true;
        await user.save();
        await OTP.deleteOne({ _id: otpData._id });

        return res.status(200).json({ success: true, message: "Email Verified Successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const resendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.isVerified) return res.status(400).json({ success: false, message: "Already verified" });

        await OTP.deleteMany({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        await OTP.create({
            email,
            otp,
            expireAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail(
            email,
            "Email Verification OTP",
            `<h2>Email Verification</h2><p>Your OTP is:</p><h1>${otp}</h1><p>Valid for 5 minutes.</p>`
        );

        res.json({ success: true, message: "OTP Sent Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    signup,
    login,
    forgetPassword,
    verifyOTP,
    resetPassword,
    verifyRegistration,
    logout,
    me,
    resendVerificationOTP
};