const nodemailer = require('nodemailer');

// Create email transporter (update with your email service credentials)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@vitaltrack.com',
      to: userEmail,
      subject: 'Welcome to VitalTrack!',
      html: `
        <h2>Welcome ${userName}!</h2>
        <p>Thank you for joining VitalTrack - Your Personal Health Companion.</p>
        <p>Start tracking your vital signs today and get personalized health insights.</p>
        <p>Best regards,<br>The VitalTrack Team</p>
      `
    });
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendHealthAlertEmail = async (userEmail, userName, alert) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@vitaltrack.com',
      to: userEmail,
      subject: `⚠️ VitalTrack Health Alert: ${alert.category}`,
      html: `
        <h3>Health Alert</h3>
        <p>Hi ${userName},</p>
        <p><strong>${alert.category}:</strong> ${alert.message}</p>
        <p>Please review your health data in the VitalTrack app.</p>
        <p>Best regards,<br>The VitalTrack Team</p>
      `
    });
    console.log(`Alert email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending alert email:', error);
  }
};

const sendWeeklyReportEmail = async (userEmail, userName, stats) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@vitaltrack.com',
      to: userEmail,
      subject: 'Your VitalTrack Weekly Report',
      html: `
        <h2>Your Weekly Health Report</h2>
        <p>Hi ${userName},</p>
        <p>Here's a summary of your health data from this week:</p>
        <ul>
          ${stats.heartRate ? `<li>Average Heart Rate: ${stats.heartRate.avg} bpm</li>` : ''}
          ${stats.weight ? `<li>Average Weight: ${stats.weight.avg} kg</li>` : ''}
          ${stats.sleep ? `<li>Average Sleep: ${stats.sleep.avg} hours</li>` : ''}
          ${stats.steps ? `<li>Average Steps: ${stats.steps.avg.toFixed(0)}</li>` : ''}
        </ul>
        <p>Keep up the good work on your health journey!</p>
        <p>Best regards,<br>The VitalTrack Team</p>
      `
    });
    console.log(`Weekly report email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending weekly report email:', error);
  }
};

const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@vitaltrack.com',
      to: userEmail,
      subject: 'VitalTrack - Password Reset Request',
      html: `
        <h3>Password Reset Request</h3>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The VitalTrack Team</p>
      `
    });
    console.log(`Password reset email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendHealthAlertEmail,
  sendWeeklyReportEmail,
  sendPasswordResetEmail
};
