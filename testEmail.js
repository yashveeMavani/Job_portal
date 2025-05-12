require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

sendEmail('yashveemavani@gmail.com', 'Test Email', 'This is a test email.')
  .then(() => console.log('Email sent successfully'))
  .catch(err => console.error('Failed to send email:', err));