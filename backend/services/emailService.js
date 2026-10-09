import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
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
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || '';
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[EmailService] SMTP credentials missing (SMTP_USER or SMTP_PASS not set).');
    return null;
  }

  // If host is Gmail, use nodemailer's built-in gmail service configuration
  if (host.includes('gmail') || user.includes('@gmail.com')) {
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <title>Successfully Registered - Global Nagas Institute</title>
      <style type="text/css">
        body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f2e8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        * { box-sizing: border-box; }
        @media only screen and (max-width: 600px) {
          .outer-table { padding: 6px 4px !important; }
          .card-box { width: 100% !important; border-radius: 8px !important; }
          .header-box { padding: 20px 14px !important; }
          .content-box { padding: 16px 12px !important; }
          .header-title { font-size: 19px !important; }
          .greeting-text { font-size: 16px !important; }
          .field-card { padding: 9px 12px !important; margin-bottom: 7px !important; }
          .field-label { font-size: 10px !important; }
          .field-val { font-size: 13.5px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7f2e8; color: #241a16;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-table" style="background-color: #f7f2e8; padding: 18px 8px;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="card-box" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e6dcd0; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td class="header-box" style="background-color: #6b4030; padding: 26px 20px; text-align: center; color: #ffffff;">
                  <p style="margin: 0 0 4px; color: #d4a373; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Global Nagas Institute</p>
                  <h1 class="header-title" style="margin: 0 0 8px; font-size: 22px; line-height: 1.3; color: #ffffff; word-break: break-word;">Heritage Framework &amp; Repository</h1>
                  <div style="display: inline-block; background-color: #2d6a4f; color: #ffffff; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ✓ Successfully Registered
                  </div>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td class="content-box" style="padding: 22px 18px;">
                  <div class="greeting-text" style="font-size: 17px; font-weight: 700; color: #6b4030; margin-bottom: 8px; word-break: break-word;">
                    Vanakkam &amp; Welcome, ${fullNameSafe}!
                  </div>
                  <p style="font-size: 14px; line-height: 1.5; color: #4a2c20; margin: 0 0 16px;">
                    We are delighted to confirm that your application has been <strong>successfully registered</strong> with Global Nagas Institute.
                  </p>

                  <!-- Details Stacked Cards -->
                  <div class="field-card" style="background-color: #faf8f5; border: 1px solid #ede5dc; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Candidate Name</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 600; color: #241a16; word-break: break-word; overflow-wrap: anywhere;">${fullNameSafe}</div>
                  </div>

                  <div class="field-card" style="background-color: #faf8f5; border: 1px solid #ede5dc; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Registered Email</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 500; color: #241a16; word-break: break-all; overflow-wrap: anywhere;">${escapeHtml(customerEmail)}</div>
                  </div>

                  <div class="field-card" style="background-color: #faf8f5; border: 1px solid #ede5dc; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Contact Phone</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 600; color: #241a16; word-break: break-word; overflow-wrap: anywhere;">${phoneSafe}</div>
                  </div>

                  <div class="field-card" style="background-color: #fbf8f2; border: 1px solid #ede3d2; border-left: 4px solid #b89555; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Selected Skill Pillar</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 700; color: #6b4030; word-break: break-word; overflow-wrap: anywhere;">${skillSafe}</div>
                  </div>

                  <div class="field-card" style="background-color: #faf8f5; border: 1px solid #ede5dc; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Experience Level</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 500; color: #241a16; word-break: break-word; overflow-wrap: anywhere;">${experienceSafe}</div>
                  </div>

                  <div class="field-card" style="background-color: #faf8f5; border: 1px solid #ede5dc; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Location</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 500; color: #241a16; word-break: break-word; overflow-wrap: anywhere;">${locationSafe}</div>
                  </div>

                  <!-- Next Steps Box -->
                  <div style="background-color: #fbf5eb; border-left: 4px solid #b89555; padding: 13px 14px; margin: 16px 0; border-radius: 6px; font-size: 13.5px; line-height: 1.5; color: #4a2c20; box-sizing: border-box; word-break: break-word;">
                    <strong style="color: #6b4030;">What happens next?</strong><br>
                    Our master artisans and admissions team will review your application. You will receive further orientation details and curriculum schedules within <strong>24–48 hours</strong>.
                  </div>

                  <p style="font-size: 13px; line-height: 1.5; color: #6b4030; margin: 14px 0 0; word-break: break-word;">
                    If you have any questions, reply directly to this email or reach us at <a href="mailto:${adminEmail}" style="color: #6b4030; font-weight: 600;">${adminEmail}</a>.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f3ede2; padding: 16px 18px; text-align: center; font-size: 11.5px; color: #7a6e65; line-height: 1.4; word-break: break-word;">
                  © ${new Date().getFullYear()} Global Nagas Institute. Preserving and revitalizing ancient heritage traditions.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <title>New ${professionSafe || 'Applicant'} Registration Alert</title>
      <style type="text/css">
        body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        * { box-sizing: border-box; }
        @media only screen and (max-width: 600px) {
          .outer-table { padding: 6px 4px !important; }
          .card-box { width: 100% !important; border-radius: 8px !important; }
          .header-box { padding: 18px 14px !important; }
          .content-box { padding: 16px 12px !important; }
          .header-title { font-size: 17px !important; line-height: 1.35 !important; }
          .field-card { padding: 9px 12px !important; margin-bottom: 7px !important; }
          .field-label { font-size: 10px !important; }
          .field-val { font-size: 13.5px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; color: #1e293b;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-table" style="background-color: #f1f5f9; padding: 18px 8px;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="card-box" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td class="header-box" style="background-color: #0f172a; padding: 22px 20px; color: #ffffff;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Global Nagas Institute</p>
                  <h2 class="header-title" style="margin: 0 0 6px; font-size: 19px; line-height: 1.35; color: #ffffff; font-weight: 700; word-break: break-word; overflow-wrap: anywhere;">🔔 New ${professionSafe || 'Applicant'} Registration Alert</h2>
                  <div style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 600; margin-top: 6px; word-break: break-word;">
                    Received: ${escapeHtml(submittedAt)} IST
                  </div>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td class="content-box" style="padding: 20px 18px;">
                  <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5; color: #334155;">
                    A new candidate with profession <strong style="color: #0f172a;">${professionSafe || 'Applicant'}</strong> has submitted the application form:
                  </p>

                  <!-- 1. Full Name -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Full Name</div>
                    <div class="field-val" style="font-size: 15px; font-weight: 600; color: #0f172a; word-break: break-word; overflow-wrap: anywhere; word-wrap: break-word;">${fullNameSafe}</div>
                  </div>

                  <!-- 2. Email Address -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Email Address</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 500; word-break: break-all; overflow-wrap: anywhere; word-wrap: break-word;">
                      <a href="mailto:${emailSafe}" style="color: #2563eb; text-decoration: none;">${emailSafe}</a>
                    </div>
                  </div>

                  <!-- 3. Mobile / WhatsApp -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Mobile / WhatsApp</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 600; word-break: break-word; overflow-wrap: anywhere;">
                      <a href="tel:${phoneSafe}" style="color: #0f172a; text-decoration: none;">${phoneSafe}</a>
                    </div>
                  </div>

                  <!-- 4. Location & Country -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Location &amp; Country</div>
                    <div class="field-val" style="font-size: 14px; color: #0f172a; font-weight: 500; word-break: break-word; overflow-wrap: anywhere;">${locationSafe}, ${countrySafe}</div>
                  </div>

                  <!-- 5. Profession / Background -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Profession / Background</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 700; color: #0f172a; word-break: break-word; overflow-wrap: anywhere;">${professionSafe}</div>
                  </div>

                  <!-- 6. Interested Skill Pillar -->
                  <div class="field-card" style="background-color: #fbf8f2; border: 1px solid #ede3d2; border-left: 4px solid #b89555; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #8c6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Interested Heritage Skill Pillar</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 700; color: #6b4030; word-break: break-word; overflow-wrap: anywhere;">${skillSafe}</div>
                  </div>

                  <!-- 7. Prior Experience Level -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">Prior Experience Level</div>
                    <div class="field-val" style="font-size: 14px; font-weight: 600; color: #0f172a; word-break: break-word; overflow-wrap: anywhere;">${experienceSafe}</div>
                  </div>

                  <!-- 8. Purpose of Learning -->
                  <div class="field-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 14px; margin-bottom: 12px; box-sizing: border-box;">
                    <div class="field-label" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Purpose of Learning</div>
                    <div class="field-val" style="font-size: 13px; line-height: 1.55; color: #1e293b; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; word-wrap: break-word;">${purposeSafe}</div>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 18px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.4; word-break: break-word;">
                  Admissions Alert dispatched to Admin: <strong>${escapeHtml(adminEmail)}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (!transporter) {
    console.warn(`[EmailService] SMTP not configured. Admin alert to [${adminEmail}] simulated.`);
    return { success: false, simulated: true, recipient: adminEmail };
  }

  const professionText = data.profession ? data.profession.trim() : 'Applicant';

  const mailOptions = {
    from: fromAddress,
    to: adminEmail,
    subject: `[New ${professionText} Registration] ${data.fullName} - ${data.interestedSkill}`,
    text: `New ${professionText} Registration Alert:\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.fullPhone || data.phone}\nLocation: ${data.location}\nProfession: ${data.profession}\nSkill: ${data.interestedSkill}\nExperience: ${data.experienceLevel}\nPurpose: ${data.learningPurpose}\nSubmitted at: ${submittedAt} IST`,
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
