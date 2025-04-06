const nodemailer = require('nodemailer');

// Use environment variables to store credentials securely
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail's SMTP service
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASSWORD,  // Your app password (if 2FA enabled)
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,  // Sender address
  to: 'recipient@example.com',   // Receiver address
  subject: 'Test Email',
  text: 'Hello, this is a test email from Nodemailer!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error sending email:', error);
  }
  console.log('Email sent:', info.response);
});
