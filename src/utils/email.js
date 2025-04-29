import nodemailer from "nodemailer"; 

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.APP_PASS, // Your email password
  },
});

/**
 * Send an email notification.
 * @param {String} to - Recipient email address.
 * @param {String} subject - Email subject.
 * @param {String} text - Email content.
 */
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Deposito System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default { sendEmail };