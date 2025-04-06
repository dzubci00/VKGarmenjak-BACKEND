const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use smtp.gmail.com for more control
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password (or app-specific password if 2FA is enabled)
  },
});
console.log(process.env.EMAIL_USER,process.env.EMAIL_PASSWORD)
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://yourfrontenddomain/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Your Gmail address
    to: email,
    subject: "Verify Your Email",
    html: `<p>Thank you for signing up! Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending verification email.");
  }
};

module.exports = { sendVerificationEmail };
