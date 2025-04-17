const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/mailer');


const otpStore = {};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const otp = generateOTP(6);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore[user.id] = { otp, expiresAt };
    console.log('Generated OTP:', otp);

    await sendOTPEmail(user.email, otp);

    res.json({ message: 'Login successful. OTP sent to your email.', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};
exports.requestOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const record = otpStore[userId];
    if (!record) {
      return res.status(400).json({ error: 'No OTP found for this user. Please login again.' });
    }

    await sendOTPEmail(userEmail, record.otp);

    res.json({ message: 'OTP resent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OTP request failed' });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const userId = req.user.id;
    const userOtp = String(req.body.otp);

    const record = otpStore[userId];
   if (!record) {
      return res.status(400).json({ error: 'OTP not found. Please login again.' });
    }

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (record.otp !== userOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    delete otpStore[userId];
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
};
