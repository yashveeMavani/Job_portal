const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};
