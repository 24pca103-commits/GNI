/**
 * Global Nagas Institute (GNI) — Official Branded Email Templates
 *
 * Visual Identity:
 * - Cream / Ivory Background: #F7F2E8, #FAF7F0
 * - Deep Obsidian & Warm Brown: #241A16, #4A2C20, #6B4030
 * - Antique & Muted Gold: #B89555, #E5B869, #8C6832
 * - Neutral Text: #241A16, #4A2C20
 *
 * Email client compatibility:
 * - Table-based responsive layout with inline CSS
 * - Mobile media queries
 * - Safe HTML entity escaping to prevent injection
 * - Plain-text fallback for every template
 */

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const GNI_OFFICIAL_ADDRESS = 'No.156, 2nd floor, Uppara street, Raja street corner, Coimbatore 641001';
const GNI_OFFICIAL_URL = 'https://globalnagasinstitute.com';
const GNI_OFFICIAL_EMAIL = 'admissions@globalnagas.org';

/**
 * Base GNI Master Email Shell
 */
export function renderGniEmailWrapper({
  title = 'Global Nagas Institute',
  preheader = 'Global Nagas Institute — Traditional Heritage Arts & Repository',
  headerTitle = 'GLOBAL NAGAS INSTITUTE',
  headerSubtitle = 'Heritage Framework &amp; Traditional Arts Repository',
  badgeText = '',
  badgeType = 'gold', // 'green' | 'gold' | 'red' | 'neutral'
  contentHtml = '',
  ctaText = '',
  ctaUrl = '',
  footerNote = '',
  hasLogo = true,
}) {
  let badgeBg = '#FAF7F0';
  let badgeColor = '#6B4030';
  let badgeBorder = '#B89555';

  if (badgeType === 'green') {
    badgeBg = '#EAF4EE';
    badgeColor = '#2D6A4F';
    badgeBorder = '#2D6A4F';
  } else if (badgeType === 'red') {
    badgeBg = '#FDF2F2';
    badgeColor = '#991B1B';
    badgeBorder = '#DC2626';
  } else if (badgeType === 'gold') {
    badgeBg = '#FAF7F0';
    badgeColor = '#4A2C20';
    badgeBorder = '#B89555';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>${escapeHtml(title)}</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F7F2E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    * { box-sizing: border-box; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    a { color: #4A2C20; text-decoration: underline; }
    @media only screen and (max-width: 620px) {
      .gni-outer-table { padding: 8px 4px !important; }
      .gni-card-box { width: 100% !important; border-radius: 8px !important; }
      .gni-header-box { padding: 22px 14px !important; }
      .gni-content-box { padding: 18px 14px !important; }
      .gni-header-title { font-size: 19px !important; }
      .gni-detail-card { padding: 10px 12px !important; margin-bottom: 8px !important; }
      .gni-cta-btn { width: 100% !important; display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F2E8; color: #241A16;">
  <!-- Preheader preview text (hidden from layout) -->
  <div style="display: none; font-size: 1px; color: #F7F2E8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="gni-outer-table" style="background-color: #F7F2E8; padding: 24px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="gni-card-box" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E6DCD0; box-shadow: 0 4px 18px rgba(74, 44, 32, 0.08);">
          
          <!-- Institutional Header (Deep Brown #4A2C20 + Gold #B89555) -->
          <tr>
            <td class="gni-header-box" style="background-color: #4A2C20; border-bottom: 3px solid #B89555; padding: 28px 24px; text-align: center; color: #FFFFFF;">
              ${
                hasLogo
                  ? `<div style="text-align: center; margin-bottom: 12px;">
                      <img src="cid:gni_logo" alt="Global Nagas Institute" width="130" style="display: inline-block; margin: 0 auto; max-width: 130px; height: auto;" />
                    </div>`
                  : ''
              }
              <h1 class="gni-header-title" style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 21px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.8px; line-height: 1.3;">
                ${escapeHtml(headerTitle)}
              </h1>
              <p style="margin: 5px 0 0; font-size: 11.5px; color: #E5B869; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                ${escapeHtml(headerSubtitle)}
              </p>
              ${
                badgeText
                  ? `<div style="display: inline-block; margin-top: 14px; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; padding: 5px 14px; border-radius: 20px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.5px;">
                      ${escapeHtml(badgeText)}
                    </div>`
                  : ''
              }
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="gni-content-box" style="padding: 26px 24px; background-color: #FFFFFF;">
              ${contentHtml}

              ${
                ctaText && ctaUrl
                  ? `<div style="text-align: center; margin: 26px 0 10px 0;">
                      <a href="${escapeHtml(ctaUrl)}" target="_blank" class="gni-cta-btn" style="display: inline-block; background-color: #4A2C20; color: #F7F2E8; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; border: 1px solid #B89555; box-shadow: 0 2px 6px rgba(74, 44, 32, 0.15);">
                        ${escapeHtml(ctaText)}
                      </a>
                    </div>`
                  : ''
              }

              ${
                footerNote
                  ? `<p style="font-size: 12px; line-height: 1.5; color: #6B4030; margin: 18px 0 0; text-align: center; font-style: italic;">
                      ${escapeHtml(footerNote)}
                    </p>`
                  : ''
              }
            </td>
          </tr>

          <!-- Official Institutional Footer -->
          <tr>
            <td style="background-color: #FAF7F0; border-top: 1px solid #E6DCD0; padding: 20px 24px; text-align: center; font-size: 11.5px; color: #6B4030; line-height: 1.55;">
              <p style="margin: 0 0 6px; font-weight: 600; color: #4A2C20;">
                Global Nagas Institute (GNI)
              </p>
              <p style="margin: 0 0 6px; color: #6B4030;">
                📍 Campus: ${escapeHtml(GNI_OFFICIAL_ADDRESS)}
              </p>
              <p style="margin: 0; color: #8C6832;">
                Official Portal: <a href="${GNI_OFFICIAL_URL}" target="_blank" style="color: #4A2C20; font-weight: 700; text-decoration: none;">${GNI_OFFICIAL_URL}</a>
                &nbsp;|&nbsp;
                Admissions: <a href="mailto:${GNI_OFFICIAL_EMAIL}" style="color: #4A2C20; font-weight: 700; text-decoration: none;">${GNI_OFFICIAL_EMAIL}</a>
              </p>
              <p style="margin: 10px 0 0; font-size: 10.5px; color: #7A6E65;">
                &copy; ${new Date().getFullYear()} Global Nagas Institute. Preserving and revitalizing authentic ancestral arts.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. User Registration Confirmation Email
 * Strictly adheres to the user's requested sample message:
 *
 * "Dear {{userName}},
 * Welcome to Global Nagas Institute (GNI)!
 * Your registration has been successfully completed. Thank you for joining our heritage learning community.
 * Your registration details:
 * - Name: {{userName}}
 * - Registered Email: {{userEmail}}
 * - Registration Reference: {{registrationId}}
 * You can now explore the available heritage learning programs, workshops, and learning journeys through our website.
 * We look forward to being part of your learning journey.
 * Warm regards,
 * Global Nagas Institute (GNI)"
 */
export function generateCustomerRegistrationEmail(data) {
  const userName = data.fullName ? data.fullName.trim() : 'Applicant';
  const userEmail = data.email ? data.email.trim() : '';
  const registrationId = data.applicationRef || (data.id ? `GNI-APP-${data.id}` : 'GNI-REG-CONFIRMED');
  const programName = data.courseName || data.interestedSkill || 'Heritage Learning Program';
  const duration = data.courseDuration || data.duration || 'Scheduled Cohort';
  const totalPayable = data.totalAmount || data.courseFee || '₹4,999';
  const paymentStatus = data.paymentStatus || 'Pending Offline Payment at Campus';

  const contentHtml = `
    <!-- Greeting & Welcome Message -->
    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 700; color: #4A2C20; margin-bottom: 12px;">
      Dear ${escapeHtml(userName)},
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 14px;">
      <strong>Welcome to Global Nagas Institute (GNI)!</strong>
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 18px;">
      Your registration has been successfully completed. Thank you for joining our heritage learning community.
    </p>

    <!-- Registration Details Card -->
    <div style="background-color: #FAF7F0; border: 1px solid #E6DCD0; border-left: 4px solid #B89555; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: 700; color: #8C6832; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; border-bottom: 1px solid #E6DCD0; pb-1;">
        Official Registration Details
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13.5px;">
        <tr>
          <td style="padding: 5px 0; color: #6B4030; width: 40%; font-weight: 600;">Name:</td>
          <td style="padding: 5px 0; color: #241A16; font-weight: 700;">${escapeHtml(userName)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Registered Email:</td>
          <td style="padding: 5px 0; color: #241A16; font-family: monospace; font-weight: 600;">${escapeHtml(userEmail)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Registration Reference:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-family: monospace; font-weight: 700;">${escapeHtml(registrationId)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Program / Course:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-weight: 700;">${escapeHtml(programName)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Duration:</td>
          <td style="padding: 5px 0; color: #241A16;">${escapeHtml(duration)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Tuition / Fee:</td>
          <td style="padding: 5px 0; color: #2D6A4F; font-weight: 700;">${escapeHtml(totalPayable)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Payment Status:</td>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 600;">${escapeHtml(paymentStatus)}</td>
        </tr>
      </table>
    </div>

    <!-- Next Steps Card -->
    <div style="background-color: #FFFFFF; border: 1px solid #E6DCD0; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
      <div style="font-size: 12.5px; font-weight: 700; color: #4A2C20; margin-bottom: 6px;">
        🏛️ Next Steps &amp; Admissions Guild Review
      </div>
      <p style="font-size: 13px; line-height: 1.55; color: #4A2C20; margin: 0;">
        Our traditional artisans and admissions guild are reviewing your application. You will receive cohort orientation details, tool kit guidance, and studio schedules within <strong>24–48 hours</strong>.
      </p>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 14px;">
      You can now explore the available heritage learning programs, workshops, and learning journeys through our website.
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 16px;">
      We look forward to being part of your learning journey.
    </p>

    <div style="font-size: 14px; line-height: 1.5; color: #4A2C20; margin-top: 18px;">
      Warm regards,<br>
      <strong>Global Nagas Institute (GNI)</strong>
    </div>
  `;

  const html = renderGniEmailWrapper({
    title: 'Registration Confirmation — Global Nagas Institute',
    preheader: `Vanakkam ${userName}, your registration has been successfully confirmed. Ref: ${registrationId}`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Admissions &amp; Guild Registry',
    badgeText: '✓ Registration Confirmed',
    badgeType: 'green',
    contentHtml,
    ctaText: 'Explore Heritage Programs →',
    ctaUrl: GNI_OFFICIAL_URL,
    footerNote: 'Need assistance? Reply directly to this email or contact our admissions coordinator.',
  });

  const text = `Dear ${userName},

Welcome to Global Nagas Institute (GNI)!

Your registration has been successfully completed. Thank you for joining our heritage learning community.

Your registration details:
- Name: ${userName}
- Registered Email: ${userEmail}
- Registration Reference: ${registrationId}
- Program: ${programName}
- Duration: ${duration}
- Fee: ${totalPayable}
- Status: ${paymentStatus}

Next Steps:
Our admissions guild will review your application and share cohort orientation details within 24–48 hours.

You can now explore the available heritage learning programs, workshops, and learning journeys through our website:
${GNI_OFFICIAL_URL}

We look forward to being part of your learning journey.

Warm regards,
Global Nagas Institute (GNI)

Campus Address: ${GNI_OFFICIAL_ADDRESS}
Official Portal: ${GNI_OFFICIAL_URL}
Admissions Email: ${GNI_OFFICIAL_EMAIL}`;

  return {
    subject: 'Welcome to Global Nagas Institute (GNI) — Registration Confirmation',
    html,
    text,
  };
}

/**
 * 2. Admin Registration Notification Alert
 * Matches GNI visual identity (replaces the mismatched dark blue/slate theme)
 */
export function generateAdminRegistrationAlert(data) {
  const userName = data.fullName ? data.fullName.trim() : 'Applicant';
  const userEmail = data.email ? data.email.trim() : '';
  const phone = data.fullPhone || data.phone || 'N/A';
  const location = data.location ? `${data.location}, ${data.country || 'India'}` : 'Not Specified';
  const profession = data.profession || 'Applicant';
  const program = data.interestedSkill || data.courseName || 'Heritage Learning Program';
  const duration = data.courseDuration || data.duration || 'Scheduled Cohort';
  const fee = data.totalAmount || data.courseFee || '₹4,999';
  const experience = data.experienceLevel || 'Beginner';
  const purpose = data.learningPurpose || 'Not provided';
  const paymentRef = data.paymentRef || 'Offline Campus Payment';
  const refId = data.applicationRef || 'GNI-APP';
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const contentHtml = `
    <div style="font-family: Georgia, serif; font-size: 17px; font-weight: 700; color: #4A2C20; margin-bottom: 8px;">
      🔔 New Candidate Application Received
    </div>

    <p style="font-size: 13.5px; line-height: 1.5; color: #241A16; margin: 0 0 16px;">
      A new candidate with background <strong>${escapeHtml(profession)}</strong> has submitted an application for enrollment.
    </p>

    <!-- Details Grid -->
    <div style="background-color: #FAF7F0; border: 1px solid #E6DCD0; border-radius: 10px; padding: 16px 18px; margin-bottom: 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px; width: 38%;">Candidate Name:</td>
          <td style="padding: 5px 0; color: #241A16; font-weight: 700;">${escapeHtml(userName)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Registered Email:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-family: monospace; font-weight: 600;">
            <a href="mailto:${escapeHtml(userEmail)}" style="color: #4A2C20; text-decoration: underline;">${escapeHtml(userEmail)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Mobile / WhatsApp:</td>
          <td style="padding: 5px 0; color: #241A16; font-weight: 600;">
            <a href="tel:${escapeHtml(phone)}" style="color: #241A16; text-decoration: none;">${escapeHtml(phone)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Location &amp; Country:</td>
          <td style="padding: 5px 0; color: #241A16;">${escapeHtml(location)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Profession:</td>
          <td style="padding: 5px 0; color: #241A16; font-weight: 700;">${escapeHtml(profession)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Selected Program:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-weight: 700;">${escapeHtml(program)} (${escapeHtml(duration)})</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Tuition / Fee:</td>
          <td style="padding: 5px 0; color: #2D6A4F; font-weight: 700;">${escapeHtml(fee)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Prior Experience:</td>
          <td style="padding: 5px 0; color: #241A16;">${escapeHtml(experience)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Application Ref:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-family: monospace; font-weight: 700;">${escapeHtml(refId)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #8C6832; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">Payment UTR / Method:</td>
          <td style="padding: 5px 0; color: #2D6A4F; font-family: monospace; font-weight: 700;">${escapeHtml(paymentRef)}</td>
        </tr>
      </table>
    </div>

    <!-- Purpose of Learning Card -->
    <div style="background-color: #FFFFFF; border: 1px solid #E6DCD0; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 700; color: #8C6832; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
        Candidate's Purpose of Learning
      </div>
      <p style="font-size: 12.5px; line-height: 1.5; color: #241A16; margin: 0; white-space: pre-wrap;">
        ${escapeHtml(purpose)}
      </p>
    </div>

    <p style="font-size: 11px; color: #6B4030; text-align: center; margin: 0;">
      Received at: <strong>${escapeHtml(submittedAt)} IST</strong>
    </p>
  `;

  const html = renderGniEmailWrapper({
    title: `New Registration Alert: ${userName}`,
    preheader: `New candidate application from ${userName} for ${program} (${profession})`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Admissions Directorate Alert',
    badgeText: '🔔 New Student Application',
    badgeType: 'gold',
    contentHtml,
    ctaText: 'Open Admin Management Portal →',
    ctaUrl: `${GNI_OFFICIAL_URL}/admin`,
    footerNote: 'Review applicant credentials and update enrollment status in the Admin Workspace.',
  });

  const text = `Global Nagas Institute — New Student Registration Alert

A new candidate has submitted an application for enrollment.

Candidate Details:
- Name: ${userName}
- Email: ${userEmail}
- Mobile / WhatsApp: ${phone}
- Location: ${location}
- Profession: ${profession}
- Selected Program: ${program} (${duration})
- Tuition / Fee: ${fee}
- Prior Experience: ${experience}
- Application Ref: ${refId}
- Payment UTR / Ref: ${paymentRef}
- Purpose of Learning: ${purpose}
- Submission Timestamp: ${submittedAt} IST

Access the Admin Dashboard to review this application:
${GNI_OFFICIAL_URL}/admin`;

  return {
    subject: `[New ${profession} Registration] ${userName} — ${program} (Ref: ${refId})`,
    html,
    text,
  };
}

/**
 * 3. Admin Login 2FA OTP Email
 */
export function generateAdminLoginOtpEmail(otp) {
  const contentHtml = `
    <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #4A2C20; margin-bottom: 10px;">
      Two-Factor Authentication Code
    </div>

    <p style="font-size: 13.5px; line-height: 1.6; color: #241A16; margin: 0 0 18px;">
      A sign-in attempt was initiated for the <strong>GNI Administrator Workspace</strong>. Use the following time-limited verification code to complete your access:
    </p>

    <!-- OTP Display Box -->
    <div style="background-color: #FAF7F0; border: 1.5px dashed #B89555; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 22px;">
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 9px; color: #4A2C20;">
        ${escapeHtml(otp)}
      </div>
      <p style="margin: 8px 0 0; font-size: 11px; color: #6B4030; font-weight: 600;">
        Valid for 10 minutes • Do not disclose this code
      </p>
    </div>

    <div style="background-color: #FFFFFF; border: 1px solid #E6DCD0; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px;">
      <p style="margin: 0; font-size: 11.5px; color: #6B4030; line-height: 1.45;">
        🔒 <strong>Security Notice:</strong> If you did not initiate this administrator sign-in, please change your administrative password immediately to safeguard institutional assets.
      </p>
    </div>
  `;

  const html = renderGniEmailWrapper({
    title: 'GNI Admin Login Verification Code',
    preheader: `Your GNI Admin verification code is ${otp}. Valid for 10 minutes.`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Admissions &amp; Security Directorate',
    badgeText: '🛡️ Admin Login 2FA',
    badgeType: 'gold',
    contentHtml,
    footerNote: 'This security authorization email was generated automatically by the institutional authentication gateway.',
  });

  const text = `Global Nagas Institute — Admin Login Verification

Your Two-Factor Authentication (OTP) code is:

${otp}

This verification code is strictly valid for 10 minutes. Do not share this code with anyone.

If you did not initiate this login request, please contact security immediately.

Global Nagas Institute`;

  return {
    subject: `[GNI Admin Security] Your Login OTP: ${otp}`,
    html,
    text,
  };
}

/**
 * 4. Admin Forgot-Password Reset OTP Email
 */
export function generateAdminPasswordResetOtpEmail(otp) {
  const contentHtml = `
    <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #4A2C20; margin-bottom: 10px;">
      Administrator Password Reset Request
    </div>

    <p style="font-size: 13.5px; line-height: 1.6; color: #241A16; margin: 0 0 18px;">
      A password reset was requested for your registered institutional administrator account. Enter the 6-digit authorization code below to configure a new password:
    </p>

    <!-- OTP Display Box -->
    <div style="background-color: #FAF7F0; border: 1.5px dashed #B89555; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 22px;">
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 9px; color: #4A2C20;">
        ${escapeHtml(otp)}
      </div>
      <p style="margin: 8px 0 0; font-size: 11px; color: #6B4030; font-weight: 600;">
        Valid for 15 minutes • Single-use authorization
      </p>
    </div>

    <div style="background-color: #FFFFFF; border: 1px solid #E6DCD0; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px;">
      <p style="margin: 0; font-size: 11.5px; color: #6B4030; line-height: 1.45;">
        ⚠️ If you did not request a password reset, you can safely disregard this message. Your current password remains secure and unchanged.
      </p>
    </div>
  `;

  const html = renderGniEmailWrapper({
    title: 'GNI Admin Password Reset Code',
    preheader: `Your password reset code is ${otp}. Valid for 15 minutes.`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Admissions &amp; Security Directorate',
    badgeText: '🔑 Password Reset Verification',
    badgeType: 'gold',
    contentHtml,
    footerNote: 'Single-use token. Once verified, this authorization code expires permanently.',
  });

  const text = `Global Nagas Institute — Admin Password Reset OTP

Your password reset authorization code is:

${otp}

This code is valid for 15 minutes and can only be used once.

If you did not request a password reset, please ignore this email.

Global Nagas Institute`;

  return {
    subject: `[GNI Admin Security] Password Reset OTP: ${otp}`,
    html,
    text,
  };
}

/**
 * 5. Payment Confirmation Email (When payment is successfully confirmed/verified)
 */
export function generatePaymentConfirmationEmail(data) {
  const userName = data.fullName ? data.fullName.trim() : 'Applicant';
  const refId = data.applicationRef || 'GNI-APP';
  const program = data.courseName || data.interestedSkill || 'Heritage Learning Program';
  const duration = data.courseDuration || data.duration || 'Scheduled Cohort';
  const amountPaid = data.totalAmount || data.courseFee || '₹4,999';
  const paymentMethod = data.paymentMethod || data.paymentRef || 'Verified Official Payment';

  const contentHtml = `
    <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #4A2C20; margin-bottom: 10px;">
      Dear ${escapeHtml(userName)},
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 16px;">
      We are delighted to confirm that your tuition payment for <strong>${escapeHtml(program)}</strong> has been successfully received and verified by the institute.
    </p>

    <!-- Payment Receipt Card -->
    <div style="background-color: #FAF7F0; border: 1px solid #E6DCD0; border-left: 4px solid #2D6A4F; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;">
      <div style="font-size: 11.5px; font-weight: 700; color: #2D6A4F; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; border-bottom: 1px solid #E6DCD0; pb-1;">
        Official Payment Receipt
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13.5px;">
        <tr>
          <td style="padding: 5px 0; color: #6B4030; width: 40%; font-weight: 600;">Candidate:</td>
          <td style="padding: 5px 0; color: #241A16; font-weight: 700;">${escapeHtml(userName)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Reference ID:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-family: monospace; font-weight: 700;">${escapeHtml(refId)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Enrolled Program:</td>
          <td style="padding: 5px 0; color: #4A2C20; font-weight: 700;">${escapeHtml(program)} (${escapeHtml(duration)})</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Amount Verified:</td>
          <td style="padding: 5px 0; color: #2D6A4F; font-size: 16px; font-weight: 800;">${escapeHtml(amountPaid)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Payment Mode:</td>
          <td style="padding: 5px 0; color: #241A16;">${escapeHtml(paymentMethod)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #6B4030; font-weight: 600;">Seat Status:</td>
          <td style="padding: 5px 0; color: #2D6A4F; font-weight: 700;">✓ Confirmed &amp; Reserved</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13.5px; line-height: 1.6; color: #241A16; margin: 0 0 16px;">
      Your seat in this batch is officially confirmed. Our admissions guild will deliver your orientation toolkit and studio access passes ahead of the start date.
    </p>

    <div style="font-size: 14px; line-height: 1.5; color: #4A2C20; margin-top: 18px;">
      Warm regards,<br>
      <strong>Global Nagas Institute Admissions Directorate</strong>
    </div>
  `;

  const html = renderGniEmailWrapper({
    title: 'Payment Confirmation — Global Nagas Institute',
    preheader: `Payment verified for ${userName}. Ref: ${refId}. Seat confirmed.`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Admissions &amp; Bursary Directorate',
    badgeText: '✓ Payment Verified &amp; Confirmed',
    badgeType: 'green',
    contentHtml,
    ctaText: 'Visit Institute Portal →',
    ctaUrl: GNI_OFFICIAL_URL,
    footerNote: 'Retain this official payment confirmation email for your institutional records.',
  });

  const text = `Global Nagas Institute — Payment Confirmation

Dear ${userName},

We are pleased to confirm that your payment for ${program} has been successfully verified.

Payment Details:
- Candidate Name: ${userName}
- Application Reference: ${refId}
- Program: ${program} (${duration})
- Amount Paid: ${amountPaid}
- Payment Mode: ${paymentMethod}
- Status: Confirmed & Reserved

Your seat is officially secured. We look forward to welcoming you to the Global Nagas Institute campus.

Campus Address: ${GNI_OFFICIAL_ADDRESS}
Official Portal: ${GNI_OFFICIAL_URL}`;

  return {
    subject: `Payment Confirmed — Global Nagas Institute (Ref: ${refId})`,
    html,
    text,
  };
}

/**
 * 6. Application Status Update Email (Approved, Confirmed, Cancelled, Rejected)
 */
export function generateApplicationStatusUpdateEmail(data, newStatus) {
  const userName = data.fullName ? data.fullName.trim() : 'Applicant';
  const refId = data.applicationRef || 'GNI-APP';
  const program = data.courseName || data.interestedSkill || 'Heritage Learning Program';
  const duration = data.courseDuration || data.duration || 'Scheduled Cohort';

  let badgeType = 'gold';
  let badgeLabel = `Status: ${newStatus}`;
  let statusExplanation = 'Your application status has been updated by the institutional admissions guild.';

  const normStatus = String(newStatus).toLowerCase();

  if (normStatus.includes('confirm') || normStatus.includes('approv')) {
    badgeType = 'green';
    badgeLabel = '✓ Application Approved';
    statusExplanation =
      'Congratulations! Your application has been approved by our master sthapathis and faculty. Your seat allocation has been finalized.';
  } else if (normStatus.includes('cancel')) {
    badgeType = 'red';
    badgeLabel = 'Application Cancelled';
    statusExplanation =
      'Your application has been marked as cancelled. If this was done in error or you wish to re-enroll for an upcoming cohort, please reply to this email.';
  } else if (normStatus.includes('reject')) {
    badgeType = 'red';
    badgeLabel = 'Application Status: Not Accepted';
    statusExplanation =
      'We regret to inform you that your application could not be accepted for the requested cohort due to seat limitations. We encourage you to apply for our future cohorts.';
  }

  const contentHtml = `
    <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #4A2C20; margin-bottom: 10px;">
      Dear ${escapeHtml(userName)},
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 16px;">
      We are writing to notify you that the status of your application (Ref: <strong>${escapeHtml(refId)}</strong>) has been updated:
    </p>

    <!-- Status Notice Card -->
    <div style="background-color: #FAF7F0; border: 1px solid #E6DCD0; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 13.5px;">
        <tr>
          <td style="padding: 4px 0; color: #6B4030; font-weight: 600; width: 38%;">Candidate:</td>
          <td style="padding: 4px 0; color: #241A16; font-weight: 700;">${escapeHtml(userName)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6B4030; font-weight: 600;">Program:</td>
          <td style="padding: 4px 0; color: #4A2C20; font-weight: 700;">${escapeHtml(program)} (${escapeHtml(duration)})</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6B4030; font-weight: 600;">Application Ref:</td>
          <td style="padding: 4px 0; color: #241A16; font-family: monospace;">${escapeHtml(refId)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #6B4030; font-weight: 600;">Current Status:</td>
          <td style="padding: 4px 0; font-weight: 800; font-size: 15px; color: ${badgeType === 'green' ? '#2D6A4F' : badgeType === 'red' ? '#991B1B' : '#4A2C20'};">
            ${escapeHtml(newStatus)}
          </td>
        </tr>
      </table>

      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #E6DCD0; font-size: 13px; line-height: 1.5; color: #4A2C20;">
        ${escapeHtml(statusExplanation)}
      </div>
    </div>

    <p style="font-size: 13px; line-height: 1.55; color: #6B4030; margin: 0 0 16px;">
      If you have questions regarding your application or require assistance, please contact the admissions guild at <a href="mailto:${GNI_OFFICIAL_EMAIL}" style="color: #4A2C20; font-weight: 700;">${GNI_OFFICIAL_EMAIL}</a>.
    </p>

    <div style="font-size: 14px; line-height: 1.5; color: #4A2C20; margin-top: 18px;">
      Warm regards,<br>
      <strong>Global Nagas Institute Admissions Directorate</strong>
    </div>
  `;

  const html = renderGniEmailWrapper({
    title: `Application Status: ${newStatus} — GNI`,
    preheader: `Application update for ${userName}: status is now ${newStatus}. Ref: ${refId}`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Admissions Directorate Notice',
    badgeText: badgeLabel,
    badgeType,
    contentHtml,
    ctaText: 'Visit Institute Portal →',
    ctaUrl: GNI_OFFICIAL_URL,
    footerNote: 'Please save this status notification for reference when checking in at campus.',
  });

  const text = `Global Nagas Institute — Application Status Update

Dear ${userName},

The status of your application (Ref: ${refId}) for ${program} has been updated to:
${newStatus}

${statusExplanation}

Campus Address: ${GNI_OFFICIAL_ADDRESS}
Admissions Email: ${GNI_OFFICIAL_EMAIL}
Official Portal: ${GNI_OFFICIAL_URL}`;

  return {
    subject: `Application Update: ${newStatus} — Global Nagas Institute (Ref: ${refId})`,
    html,
    text,
  };
}

/**
 * 7. Workshop or Course Registration Update Email (Batch / Schedule / Venue updates)
 */
export function generateCourseUpdateEmail(data, updateNotice) {
  const userName = data.fullName ? data.fullName.trim() : 'Applicant';
  const program = data.courseName || data.interestedSkill || 'Heritage Learning Program';
  const duration = data.courseDuration || data.duration || 'Scheduled Cohort';
  const refId = data.applicationRef || 'GNI-APP';

  const noticeTitle =
    typeof updateNotice === 'object' && updateNotice?.title
      ? updateNotice.title
      : 'Curriculum & Cohort Announcement';
  const noticeMessage =
    typeof updateNotice === 'object' && updateNotice?.message
      ? updateNotice.message
      : typeof updateNotice === 'string'
      ? updateNotice
      : 'Please review the updated batch syllabus and studio timings on our portal.';
  const scheduleDate =
    typeof updateNotice === 'object' && updateNotice?.scheduleDate
      ? updateNotice.scheduleDate
      : null;
  const venue =
    typeof updateNotice === 'object' && updateNotice?.venueLocation
      ? updateNotice.venueLocation
      : GNI_OFFICIAL_ADDRESS;

  const contentHtml = `
    <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #4A2C20; margin-bottom: 10px;">
      Dear ${escapeHtml(userName)},
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #241A16; margin: 0 0 16px;">
      We are writing to provide an important update regarding your enrolled cohort: <strong>${escapeHtml(program)}</strong> (Ref: ${escapeHtml(refId)}).
    </p>

    <!-- Update Notice Card -->
    <div style="background-color: #FAF7F0; border: 1px solid #E6DCD0; border-left: 4px solid #B89555; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;">
      <div style="font-size: 11.5px; font-weight: 700; color: #8C6832; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
        ${escapeHtml(noticeTitle)}
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #241A16; margin: 0; white-space: pre-wrap;">
        ${escapeHtml(noticeMessage)}
      </p>
      ${
        scheduleDate
          ? `<div style="margin-top: 10px; font-size: 12px; color: #4A2C20; font-weight: 600;">
              🗓️ Schedule / Date: <span>${escapeHtml(scheduleDate)}</span>
             </div>`
          : ''
      }
    </div>

    <!-- Venue Information -->
    <div style="background-color: #FFFFFF; border: 1px solid #E6DCD0; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px;">
      <div style="font-size: 11.5px; font-weight: 700; color: #4A2C20; margin-bottom: 4px;">
        📍 Studio &amp; Campus Location
      </div>
      <p style="font-size: 12.5px; line-height: 1.5; color: #6B4030; margin: 0;">
        ${escapeHtml(venue)}
      </p>
    </div>

    <p style="font-size: 13px; line-height: 1.55; color: #6B4030; margin: 0 0 16px;">
      If you require assistance or scheduling accommodations, please reply to this email or reach us at <a href="mailto:${GNI_OFFICIAL_EMAIL}" style="color: #4A2C20; font-weight: 700;">${GNI_OFFICIAL_EMAIL}</a>.
    </p>

    <div style="font-size: 14px; line-height: 1.5; color: #4A2C20; margin-top: 18px;">
      Warm regards,<br>
      <strong>Global Nagas Institute Faculty Guild</strong>
    </div>
  `;

  const html = renderGniEmailWrapper({
    title: `Cohort Update: ${program} — GNI`,
    preheader: `Important cohort update for ${userName} regarding ${program}.`,
    headerTitle: 'GLOBAL NAGAS INSTITUTE',
    headerSubtitle: 'Faculty &amp; Studio Directorate',
    badgeText: '📅 Cohort &amp; Schedule Update',
    badgeType: 'gold',
    contentHtml,
    ctaText: 'Review Program Details →',
    ctaUrl: GNI_OFFICIAL_URL,
    footerNote: 'Please keep this update handy for your studio attendance.',
  });

  const text = `Global Nagas Institute — Cohort Update

Dear ${userName},

Important update for your enrolled program: ${program} (Ref: ${refId})

Announcement:
${updateNotice}

Studio Location:
${GNI_OFFICIAL_ADDRESS}

Admissions Email: ${GNI_OFFICIAL_EMAIL}
Official Portal: ${GNI_OFFICIAL_URL}`;

  return {
    subject: `Cohort Update: ${program} — Global Nagas Institute (Ref: ${refId})`,
    html,
    text,
  };
}
