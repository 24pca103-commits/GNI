import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  generateCustomerRegistrationEmail,
  generateAdminRegistrationAlert,
  generateAdminLoginOtpEmail,
  generateAdminPasswordResetOtpEmail,
  generatePaymentConfirmationEmail,
  generateApplicationStatusUpdateEmail,
  generateCourseUpdateEmail,
} from './emailTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

/**
 * Creates and returns Nodemailer transporter using environment variables
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || '';
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  // If host is Gmail, use nodemailer's built-in gmail service configuration
  if (host.includes('gmail') || (user && user.includes('@gmail.com'))) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host: host || 'smtp.hostinger.com',
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Resolves the official GNI logo attachment for inline CID embedding
 */
function getLogoAttachment() {
  const possiblePaths = [
    path.resolve(__dirname, '../assets/logo.png'),
    path.resolve(__dirname, '../../frontend/public/logo.png'),
    path.resolve(__dirname, '../public/logo.png'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return [
        {
          filename: 'gni-logo.png',
          path: p,
          cid: 'gni_logo',
        },
      ];
    }
  }

  return [];
}

/**
 * Formats sender address with institutional display name
 */
function getFromAddress(displayName = 'Global Nagas Institute') {
  const smtpUser = process.env.SMTP_USER || 'admissions@globalnagas.org';
  if (process.env.SMTP_FROM && process.env.SMTP_FROM.includes('<')) {
    return process.env.SMTP_FROM;
  }
  return `"${displayName}" <${smtpUser}>`;
}

/**
 * 1. Send User Registration Confirmation Email
 */
export async function sendCustomerRegistrationEmail(data) {
  const transporter = getTransporter();
  const customerEmail = data.email ? String(data.email).trim() : '';

  if (!customerEmail) {
    return {
      success: false,
      error: 'Missing recipient email address.',
    };
  }

  const template = generateCustomerRegistrationEmail(data);
  const fromAddress = getFromAddress('Global Nagas Institute');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Customer confirmation simulated for: ${customerEmail}`);
    return {
      success: true,
      simulated: true,
      recipient: customerEmail,
      subject: template.subject,
    };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: customerEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Customer confirmation sent to ${customerEmail} (ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
      recipient: customerEmail,
    };
  } catch (error) {
    console.error(`[EmailService] Failed to send confirmation to ${customerEmail}:`, error.message);
    return {
      success: false,
      error: error.message,
      recipient: customerEmail,
    };
  }
}

/**
 * 2. Send Real-Time Registration Notification to Admin
 */
export async function sendAdminRegistrationAlert(data) {
  const transporter = getTransporter();
  const rawAdminEmail = process.env.ADMIN_EMAIL || 'kan93095@gmail.com';
  const adminRecipients = rawAdminEmail
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const template = generateAdminRegistrationAlert(data);
  const fromAddress = getFromAddress('GNI Admissions Directorate');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Admin alert simulated for: ${adminRecipients.join(', ')}`);
    return {
      success: true,
      simulated: true,
      recipients: adminRecipients,
    };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: adminRecipients,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Admin alert sent to ${adminRecipients.join(', ')} (ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
      recipients: adminRecipients,
    };
  } catch (error) {
    console.error(`[EmailService] Failed to send admin alert:`, error.message);
    return {
      success: false,
      error: error.message,
      recipients: adminRecipients,
    };
  }
}

/**
 * Dispatch real-time notifications to both Customer and Admin in parallel
 */
export async function sendRegistrationNotifications(data) {
  try {
    const [customerSettled, adminSettled] = await Promise.allSettled([
      sendCustomerRegistrationEmail(data),
      sendAdminRegistrationAlert(data),
    ]);

    const customerResult =
      customerSettled.status === 'fulfilled'
        ? customerSettled.value
        : { success: false, error: customerSettled.reason?.message };

    const adminResult =
      adminSettled.status === 'fulfilled'
        ? adminSettled.value
        : { success: false, error: adminSettled.reason?.message };

    return {
      customerResult,
      adminResult,
      success: customerResult.success,
    };
  } catch (err) {
    console.error('[EmailService] Unexpected notification dispatch error:', err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * 3. Send Admin Login 2FA OTP Email
 */
export async function sendAdminLoginOtpEmail(adminEmail, otp) {
  const transporter = getTransporter();
  const template = generateAdminLoginOtpEmail(otp);
  const fromAddress = getFromAddress('GNI Admin Security');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.log(
      `\n========================================\n[Admin Auth] SMTP NOT CONFIGURED.\nGenerated Login OTP for [${adminEmail}]: ${otp}\nValid for: 10 minutes\n========================================\n`
    );
    return { success: true, simulated: true, recipient: adminEmail };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Admin Login OTP sent to ${adminEmail} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId, recipient: adminEmail };
  } catch (err) {
    console.error(`[EmailService] Failed to send Login OTP to ${adminEmail}:`, err.message);
    return { success: false, error: err.message, recipient: adminEmail };
  }
}

/**
 * 4. Send Admin Password Reset OTP Email
 */
export async function sendAdminPasswordResetOtpEmail(adminEmail, otp) {
  const transporter = getTransporter();
  const template = generateAdminPasswordResetOtpEmail(otp);
  const fromAddress = getFromAddress('GNI Admin Security');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.log(
      `\n========================================\n[Admin Auth] SMTP NOT CONFIGURED.\nGenerated Password Reset OTP for [${adminEmail}]: ${otp}\nValid for: 15 minutes\n========================================\n`
    );
    return { success: true, simulated: true, recipient: adminEmail };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Password Reset OTP sent to ${adminEmail} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId, recipient: adminEmail };
  } catch (err) {
    console.error(`[EmailService] Failed to send Reset OTP to ${adminEmail}:`, err.message);
    return { success: false, error: err.message, recipient: adminEmail };
  }
}

/**
 * 5. Send Payment Confirmation Email
 */
export async function sendPaymentConfirmationEmail(data) {
  const transporter = getTransporter();
  const customerEmail = data.email ? String(data.email).trim() : '';

  if (!customerEmail) {
    return { success: false, error: 'Recipient email is missing' };
  }

  const template = generatePaymentConfirmationEmail(data);
  const fromAddress = getFromAddress('Global Nagas Institute');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Payment confirmation simulated for: ${customerEmail}`);
    return { success: true, simulated: true, recipient: customerEmail };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: customerEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Payment confirmation sent to ${customerEmail} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId, recipient: customerEmail };
  } catch (err) {
    console.error(`[EmailService] Failed to send payment confirmation to ${customerEmail}:`, err.message);
    return { success: false, error: err.message, recipient: customerEmail };
  }
}

/**
 * 6. Send Application Status Update Email (Approved, Confirmed, Cancelled, Rejected)
 */
export async function sendApplicationStatusUpdateEmail(data, newStatus) {
  const transporter = getTransporter();
  const customerEmail = data.email ? String(data.email).trim() : '';

  if (!customerEmail) {
    return { success: false, error: 'Recipient email is missing' };
  }

  const template = generateApplicationStatusUpdateEmail(data, newStatus);
  const fromAddress = getFromAddress('Global Nagas Institute Admissions');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Status update simulated for: ${customerEmail}`);
    return { success: true, simulated: true, recipient: customerEmail };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: customerEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Application status update sent to ${customerEmail} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId, recipient: customerEmail };
  } catch (err) {
    console.error(`[EmailService] Failed to send status update to ${customerEmail}:`, err.message);
    return { success: false, error: err.message, recipient: customerEmail };
  }
}

/**
 * 7. Send Workshop or Course Registration Update Email
 */
export async function sendCourseUpdateEmail(data, updateNotice) {
  const transporter = getTransporter();
  const customerEmail = data.email ? String(data.email).trim() : '';

  if (!customerEmail) {
    return { success: false, error: 'Recipient email is missing' };
  }

  const template = generateCourseUpdateEmail(data, updateNotice);
  const fromAddress = getFromAddress('Global Nagas Institute');
  const logoAttachments = getLogoAttachment();

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Course update simulated for: ${customerEmail}`);
    return { success: true, simulated: true, recipient: customerEmail };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      to: customerEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: logoAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Course update sent to ${customerEmail} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId, recipient: customerEmail };
  } catch (err) {
    console.error(`[EmailService] Failed to send course update to ${customerEmail}:`, err.message);
    return { success: false, error: err.message, recipient: customerEmail };
  }
}

export default {
  sendCustomerRegistrationEmail,
  sendAdminRegistrationAlert,
  sendRegistrationNotifications,
  sendAdminLoginOtpEmail,
  sendAdminPasswordResetOtpEmail,
  sendPaymentConfirmationEmail,
  sendApplicationStatusUpdateEmail,
  sendCourseUpdateEmail,
};
