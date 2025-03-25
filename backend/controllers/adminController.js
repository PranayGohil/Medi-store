import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";

const otpStore = {};

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'adelbert.gutmann30@ethereal.email',
      pass: '5vXzdPczrSfUdZmAy4'
  }
});

export const adminLogin = async (req, res) => {
  try {
    const { userid, password } = req.body;
    console.log(req.body);
    const user = await Admin.findOne({
      $or: [{ username: userid }, { email: userid }],
    });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    const userWithoutPassword = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
    };

    const cartData = user.cartData;

    res.json({
      success: true,
      message: "logged in successfully",
      token,
      user: userWithoutPassword,
      cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check user already exist or not
    const emailExist = await Admin.findOne({ email });
    if (emailExist) {
      return res.json({ success: false, message: "Email already exist" });
    }

    // validate user email, phone and password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Admin({ username, email, password: hashedPassword });
    await user.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id; // Get admin ID from token

    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update Admin Profile (Requires Password Verification)
export const updateAdminProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const adminId = req.admin.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Verify current password before updating
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Update username and email
    if (username) admin.username = username;
    if (email) admin.email = email;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // OTP expires in 10 min

    // Send OTP via Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email" });

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore[email];

  if (!storedOtp || storedOtp.otp !== parseInt(otp)) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  res.json({ success: true, message: "OTP verified successfully" });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword, otp } = req.body;

  const storedOtp = otpStore[email];

  if (!storedOtp || storedOtp.otp !== parseInt(otp)) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Admin.findOneAndUpdate({ email }, { password: hashedPassword });

    // Remove OTP after successful password reset
    delete otpStore[email];

    res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};
