const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/otp");
const { sendOTPEmail } = require("../utils/mailer");

const otpStore = {};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt:", email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("User found:", user);

    if (user.isBlocked) {
      console.log("User is blocked");
      return res.status(403).json({ message: "User is blocked" });
    }

    console.log("Comparing passwords...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Token generated:", token);

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.requestOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const record = otpStore[userId];
    if (!record) {
      return res
        .status(400)
        .json({ error: "No OTP found for this user. Please login again." });
    }

    await sendOTPEmail(userEmail, record.otp);

    res.json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OTP request failed" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const userOtp = String(req.body.otp);

    const record = otpStore[userId];
    if (!record) {
      return res
        .status(400)
        .json({ error: "OTP not found. Please login again." });
    }

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (record.otp !== userOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    delete otpStore[userId];
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed" });
  }
};
