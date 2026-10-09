import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * HTML Escape helper to prevent HTML injection in emails
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Creates and returns Nodemailer transporter using environment variables
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

/**
 * Send real-time confirmation email to customer
 */
export async function sendCustomerRegistrationEmail(data) {
  const transporter = getTransporter();
  const customerEmail = data.email;
  const adminEmail = process.env.ADMIN_EMAIL || '24pca103@anjaconline.org';
  const fromAddress = process.env.SMTP_FROM || `"Global Nagas Institute" <${process.env.SMTP_USER || 'admissions@globalnagas.org'}>`;

  const fullNameSafe = escapeHtml(data.fullName);
  const skillSafe = escapeHtml(data.interestedSkill);
  const experienceSafe = escapeHtml(data.experienceLevel);
  const locationSafe = escapeHtml(data.location);
  const phoneSafe = escapeHtml(data.fullPhone || data.phone);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Successfully Registered - Global Nagas Institute</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f2e8; margin: 0; padding: 20px; color: #241a16; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e6dcd0; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
        .header { background: #6b4030; color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0 0 6px; font-size: 24px; letter-spacing: 0.5px; }
        .header p { margin: 0; color: #d4a373; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .badge { display: inline-block; background: #2d6a4f; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 14px; }
        .content { padding: 28px 24px; }
        .greeting { font-size: 18px; font-weight: 600; color: #6b4030; margin-bottom: 12px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #faf8f5; border-radius: 8px; overflow: hidden; }
        .details-table td { padding: 10px 14px; border-bottom: 1px solid #ede5dc; font-size: 14px; }
        .details-table td.label { font-weight: 600; color: #6b4030; width: 40%; }
        .next-steps { background: #fbf5eb; border-left: 4px solid #b89555; padding: 14px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
        .footer { background: #f3ede2; padding: 18px 24px; text-align: center; font-size: 12px; color: #7a6e65; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>Global Nagas Institute</p>
          <h1>Heritage Framework & Repository</h1>
          <span class="badge">✓ Successfully Registered</span>
        </div>
        <div class="content">
          <div class="greeting">Vanakkam & Welcome, ${fullNameSafe}!</div>
          <p>We are delighted to confirm that your application has been <strong>successfully registered</strong> with Global Nagas Institute.</p>
          
          <table class="details-table">
            <tr>
              <td class="label">Candidate Name</td>
              <td>${fullNameSafe}</td>
            </tr>
            <tr>
              <td class="label">Registered Email</td>
              <td>${escapeHtml(customerEmail)}</td>
            </tr>
            <tr>
              <td class="label">Contact Phone</td>
              <td>${phoneSafe}</td>
            </tr>
            <tr>
              <td class="label">Selected Skill Pillar</td>
              <td><strong>${skillSafe}</strong></td>
            </tr>
            <tr>
              <td class="label">Experience Level</td>
              <td>${experienceSafe}</td>
            </tr>
            <tr>
              <td class="label">Location</td>
              <td>${locationSafe}</td>
            </tr>
          </table>

          <div class="next-steps">
            <strong>What happens next?</strong><br>
            Our master artisans and admissions team will review your application. You will receive further orientation details and curriculum schedules within <strong>24–48 hours</strong>.
          </div>

          <p style="font-size: 14px; line-height: 1.5;">If you have any questions, feel free to reply directly to this email or contact us at <a href="mailto:${adminEmail}" style="color: #6b4030;">${adminEmail}</a>.</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Global Nagas Institute. Preserving and revitalizing ancient heritage traditions.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Customer email to [${customerEmail}] simulated.`);
    return { success: false, simulated: true, recipient: customerEmail };
  }

  const mailOptions = {
    from: fromAddress,
    to: customerEmail,
    subject: 'Successfully Registered | Global Nagas Institute',
    text: `Vanakkam ${data.fullName},\n\nYour application with Global Nagas Institute has been successfully registered!\n\nSkill Pillar: ${data.interestedSkill}\nExperience: ${data.experienceLevel}\nPhone: ${data.fullPhone || data.phone}\n\nOur admissions team will review your application and contact you within 24–48 hours.\n\nGlobal Nagas Institute`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EmailService] Real-time customer confirmation email sent to: ${customerEmail} (ID: ${info.messageId})`);
  return { success: true, messageId: info.messageId, recipient: customerEmail };
}

/**
 * Send real-time notification email to Admin (24pca103@anjaconline.org)
 */
export async function sendAdminRegistrationAlert(data) {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || '24pca103@anjaconline.org';
  const fromAddress = process.env.SMTP_FROM || `"GNI Admissions Alert" <${process.env.SMTP_USER || 'no-reply@globalnagas.org'}>`;

  const fullNameSafe = escapeHtml(data.fullName);
  const emailSafe = escapeHtml(data.email);
  const phoneSafe = escapeHtml(data.fullPhone || data.phone);
  const countrySafe = escapeHtml(data.country || 'India');
  const locationSafe = escapeHtml(data.location);
  const professionSafe = escapeHtml(data.profession);
  const skillSafe = escapeHtml(data.interestedSkill);
  const experienceSafe = escapeHtml(data.experienceLevel);
  const purposeSafe = escapeHtml(data.learningPurpose);
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>New Student Registration Alert</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #0f172a; color: #ffffff; padding: 22px 24px; }
        .header h2 { margin: 0 0 4px; font-size: 20px; }
        .header p { margin: 0; color: #94a3b8; font-size: 13px; }
        .badge { display: inline-block; background: #3b82f6; color: #ffffff; font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 600; margin-top: 8px; }
        .content { padding: 24px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; vertical-align: top; }
        .table td.label { font-weight: 600; color: #475569; width: 35%; background: #f8fafc; }
        .footer { background: #f8fafc; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>🔔 New Student Registration Alert</h2>
          <p>Global Nagas Institute Admissions Portal</p>
          <span class="badge">Timestamp: ${escapeHtml(submittedAt)} IST</span>
        </div>
        <div class="content">
          <p style="font-size: 15px; margin-top: 0;">A new candidate has submitted the application form:</p>

          <table class="table">
            <tr>
              <td class="label">Full Name</td>
              <td><strong>${fullNameSafe}</strong></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td><a href="mailto:${emailSafe}">${emailSafe}</a></td>
            </tr>
            <tr>
              <td class="label">Mobile / Phone</td>
              <td><a href="tel:${phoneSafe}">${phoneSafe}</a></td>
            </tr>
            <tr>
              <td class="label">Country / Location</td>
              <td>${countrySafe} (${locationSafe})</td>
            </tr>
            <tr>
              <td class="label">Profession / Background</td>
              <td>${professionSafe}</td>
            </tr>
            <tr>
              <td class="label">Interested Skill Pillar</td>
              <td><strong style="color: #6b4030;">${skillSafe}</strong></td>
            </tr>
            <tr>
              <td class="label">Experience Level</td>
              <td>${experienceSafe}</td>
            </tr>
            <tr>
              <td class="label">Purpose of Learning</td>
              <td style="white-space: pre-wrap;">${purposeSafe}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          Notification dispatched automatically to Admin: ${escapeHtml(adminEmail)}
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Admin alert to [${adminEmail}] simulated.`);
    return { success: false, simulated: true, recipient: adminEmail };
  }

  const mailOptions = {
    from: fromAddress,
    to: adminEmail,
    subject: `[New Registration] ${data.fullName} - ${data.interestedSkill}`,
    text: `New Registration Alert:\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.fullPhone || data.phone}\nLocation: ${data.location}\nProfession: ${data.profession}\nSkill: ${data.interestedSkill}\nExperience: ${data.experienceLevel}\nPurpose: ${data.learningPurpose}\nSubmitted at: ${submittedAt} IST`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EmailService] Real-time admin notification email sent to: ${adminEmail} (ID: ${info.messageId})`);
  return { success: true, messageId: info.messageId, recipient: adminEmail };
}

/**
 * Send real-time notifications to both Customer and Admin in parallel
 */
export async function sendRegistrationNotifications(data) {
  try {
    const results = await Promise.allSettled([
      sendCustomerRegistrationEmail(data),
      sendAdminRegistrationAlert(data),
    ]);

    results.forEach((res, index) => {
      const target = index === 0 ? 'Customer' : 'Admin';
      if (res.status === 'rejected') {
        console.error(`[EmailService] Failed to send email to ${target}:`, res.reason?.message || res.reason);
      }
    });

    return results;
  } catch (err) {
    console.error('[EmailService] Unexpected error sending notifications:', err.message);
  }
}

export default {
  sendCustomerRegistrationEmail,
  sendAdminRegistrationAlert,
  sendRegistrationNotifications,
};
