const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use smtp.gmail.com for more control
  auth: {
    user: "donat.zubcic@gmail.com", // Your Gmail address
    pass: "nfti mwjo gxkn uqiy", // Your Gmail password (or app-specific password if 2FA is enabled)
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://yourfrontenddomain/verify-email/${verificationToken}`;
  const mailOptions = {
    from: "donat.zubcic@gmail.com", // Your Gmail address
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
