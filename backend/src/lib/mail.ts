import nodemailer from "nodemailer";

const domain = process.env.APP_URL;

const PORT = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587;
const HOST = process.env.MAIL_HOST;
const USER = process.env.MAIL_USER;
const PASSWORD = process.env.MAIL_PASSWORD;
const IGNORE_TLS = process.env.MAIL_IGNORE_TLS === "true";
const SECURE = process.env.MAIL_SECURE === "true";
const REQUIRE_TLS = process.env.MAIL_REQUIRE_TLS === "true";

const DEFAULT_EMAIL = process.env.MAIL_DEFAULT_EMAIL;
const DEFAULT_NAME = process.env.MAIL_DEFAULT_NAME;

export const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  ignoreTLS: IGNORE_TLS,
  secure: SECURE,
  requireTLS: REQUIRE_TLS,
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: DEFAULT_EMAIL,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (
  studentEmail: string,
  studentName: string
) => {
  const subject = "Welcome to Classroom Management App";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Classroom Management App!</h2>
      <p>Dear ${studentName},</p>
      <p>You have been added to the Classroom Management App by your instructor.</p>
      <p>To get started:</p>
      <ol>
        <li>Visit our app at <a href="${domain}">${domain}</a></li>
        <li>Click on "Student Login"</li>
        <li>Enter your email address: <strong>${studentEmail}</strong></li>
        <li>You'll receive a verification code via email</li>
        <li>Complete your profile setup</li>
      </ol>
      <p>If you have any questions, please contact your instructor.</p>
      <p>Best regards,<br>Classroom Management Team</p>
    </div>
  `;

  return await sendEmail(studentEmail, subject, html);
};

export const sendEmailVerificationCode = async (
  email: string,
  code: string
) => {
  const subject = "Your Verification Code";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verification Code</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #007bff; font-size: 32px; text-align: center; background: #f8f9fa; padding: 20px; border-radius: 5px;">${code}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p>Best regards,<br>Classroom Management Team</p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};

export const sendLessonAssignedEmail = async (
  studentEmail: string,
  studentName: string,
  lessonTitle: string
) => {
  const subject = "New Lesson Assigned";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Lesson Assigned</h2>
      <p>Dear ${studentName},</p>
      <p>A new lesson has been assigned to you:</p>
      <h3 style="color: #007bff;">${lessonTitle}</h3>
      <p>Please log in to your dashboard to view the lesson details and complete it.</p>
      <p><a href="${domain}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Lesson</a></p>
      <p>Best regards,<br>Your Instructor</p>
    </div>
  `;

  return await sendEmail(studentEmail, subject, html);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
