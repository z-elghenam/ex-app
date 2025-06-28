const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  // For Gmail (you can change this based on your email service)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password for Gmail
    },
  });

  // Alternative: Using SMTP settings
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });

  return transporter;
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} - Email result
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Tour Booking"}" <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email
 * @param {Object} user - User object
 * @param {string} verificationToken - Email verification token
 */
const sendWelcomeEmail = async (user, verificationToken) => {
  const subject = `Welcome to ${process.env.APP_NAME || "Tour Booking"}!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to ${process.env.APP_NAME || "Tour Booking"}!</h1>
            </div>
            <div class="content">
                <h2>Hi ${user.firstName}!</h2>
                <p>Thank you for joining our tour booking platform. We're excited to help you discover amazing tours and experiences!</p>
                
                <p>To get started, please verify your email address by clicking the button below:</p>
                
                <a href="${
                  process.env.FRONTEND_URL
                }/verify-email?token=${verificationToken}" class="button">
                    Verify Email Address
                </a>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">
                    ${
                      process.env.FRONTEND_URL
                    }/verify-email?token=${verificationToken}
                </p>
                
                <p><strong>This verification link will expire in 24 hours.</strong></p>
                
                <p>Once verified, you can:</p>
                <ul>
                    <li>Browse and book amazing tours</li>
                    <li>Write reviews and share your experiences</li>
                    <li>Manage your bookings and profile</li>
                    ${
                      user.role === "GUIDE"
                        ? "<li>Create and manage your own tours</li>"
                        : ""
                    }
                </ul>
                
                <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The ${
                  process.env.APP_NAME || "Tour Booking"
                } Team</p>
                <p style="font-size: 12px;">
                    If you're having trouble clicking the verification button, copy and paste the URL above into your web browser.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to ${process.env.APP_NAME || "Tour Booking"}!
    
    Hi ${user.firstName}!
    
    Thank you for joining our tour booking platform. Please verify your email address by visiting:
    ${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}
    
    This link will expire in 24 hours.
    
    If you didn't create this account, please ignore this email.
    
    Best regards,
    The ${process.env.APP_NAME || "Tour Booking"} Team
  `;

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const subject = "Password Reset Request";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hi ${user.firstName}!</h2>
                <p>You requested a password reset for your ${
                  process.env.APP_NAME || "Tour Booking"
                } account.</p>
                
                <p>Click the button below to reset your password:</p>
                
                <a href="${
                  process.env.FRONTEND_URL
                }/reset-password?token=${resetToken}" class="button">
                    Reset Password
                </a>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #dc3545;">
                    ${
                      process.env.FRONTEND_URL
                    }/reset-password?token=${resetToken}
                </p>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong>
                    <ul>
                        <li>This link will expire in 10 minutes for security reasons</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Your password will remain unchanged until you click the link above</li>
                    </ul>
                </div>
                
                <p>If you continue to have problems, please contact our support team.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The ${
                  process.env.APP_NAME || "Tour Booking"
                } Team</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
    Password Reset Request
    
    Hi ${user.firstName}!
    
    You requested a password reset. Click the link below to reset your password:
    ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}
    
    This link will expire in 10 minutes.
    
    If you didn't request this reset, please ignore this email.
    
    Best regards,
    The ${process.env.APP_NAME || "Tour Booking"} Team
  `;

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send booking confirmation email
 * @param {Object} user - User object
 * @param {Object} booking - Booking object
 * @param {Object} tour - Tour object
 */
const sendBookingConfirmationEmail = async (user, booking, tour) => {
  const subject = "Booking Confirmation - Your Tour is Reserved!";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Booking Confirmed!</h1>
            </div>
            <div class="content">
                <h2>Hi ${user.firstName}!</h2>
                <p>Great news! Your tour booking has been confirmed. We can't wait for you to experience this amazing adventure!</p>
                
                <div class="booking-details">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                        <strong>Booking ID:</strong>
                        <span>#${booking.id}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Tour:</strong>
                        <span>${tour.name}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Date:</strong>
                        <span>${new Date(
                          booking.tourDate
                        ).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Participants:</strong>
                        <span>${booking.participants}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Total Amount:</strong>
                        <span>$${booking.totalAmount}</span>
                    </div>
                </div>
                
                <p><strong>What's Next?</strong></p>
                <ul>
                    <li>Save this confirmation email for your records</li>
                    <li>Check your booking details in your account dashboard</li>
                    <li>Contact us if you have any questions</li>
                </ul>
                
                <p>We're here to help make your tour experience unforgettable!</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The ${
                  process.env.APP_NAME || "Tour Booking"
                } Team</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
};
