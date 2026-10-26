import { getPool } from '../config/mysql.js';
import {
  sendCustomerRegistrationEmail,
  sendAdminRegistrationAlert,
  sendRegistrationNotifications,
} from '../services/emailService.js';
import { calculateTrustedFee } from '../models/pricingConfig.js';

export const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      countryCode,
      countryDial,
      fullPhone,
      location,
      profession,
      courseName,
      interestedSkill,
      courseDuration,
      duration,
      experienceLevel,
      learningPurpose,
      paymentRef,
    } = req.body;

    const chosenCourse = (courseName || interestedSkill || '').trim();
    const chosenDuration = (courseDuration || duration || '').trim();

    // Validate presence of required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !location ||
      !profession ||
      !chosenCourse ||
      !chosenDuration ||
      !experienceLevel ||
      !learningPurpose
    ) {
      return res.status(400).json({
        success: false,
        message: 'All application fields including Course Name and Course Duration are required.',
      });
    }

    const pool = getPool();
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check for existing registration with same email using parameterized query to prevent duplicates
    const [existingRows] = await pool.execute(
      'SELECT id, email FROM `registrations` WHERE `email` = ? LIMIT 1',
      [normalizedEmail]
    );

    if (existingRows && existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An application with this email address already exists. Please use another email or contact admissions support.',
      });
    }

    // 2. Server-side trusted calculation of course fee and total payable
    const pricing = calculateTrustedFee(chosenCourse, chosenDuration);
    const trustedFee = pricing ? pricing.fee : 4999;
    const formattedTrustedFee = pricing ? pricing.formattedFee : '₹4,999';
    const totalAmount = pricing ? pricing.totalPayable : trustedFee;
    const formattedTotal = pricing ? pricing.formattedTotal : formattedTrustedFee;
    const discountAmount = pricing ? pricing.discount : 0;
    const formattedDiscount = pricing ? pricing.formattedDiscount : '₹0';
    const taxes = pricing ? pricing.taxes : 0;
    const courseTitle = pricing ? pricing.courseName : chosenCourse;
    const validatedDuration = pricing ? pricing.duration : chosenDuration;

    // 2b. Check seat capacity & availability to prevent overbooking
    try {
      const [courseRows] = await pool.query(
        'SELECT id, title, seats_total, seats_available FROM `courses` WHERE (LOWER(title) LIKE ? OR title = ?) AND is_active = 1 LIMIT 1',
        [`%${courseTitle.toLowerCase()}%`, courseTitle]
      );
      if (courseRows && courseRows.length > 0) {
        const c = courseRows[0];
        const [bookRows] = await pool.query(
          `SELECT COUNT(*) as cnt FROM \`registrations\` WHERE (LOWER(interested_skill) LIKE ? OR interested_skill = ?) AND payment_status NOT IN ('Cancelled', 'Rejected')`,
          [`%${c.title.toLowerCase()}%`, c.title]
        );
        const booked = bookRows[0]?.cnt || 0;
        const total = Number(c.seats_total || 50);
        const available = Math.max(0, total - booked);

        if (available <= 0) {
          return res.status(409).json({
            success: false,
            message: `We apologize, but '${c.title}' is currently fully booked (${total}/${total} seats confirmed). No seats are available for registration at this time.`,
          });
        }
      }
    } catch (seatErr) {
      console.warn('[RegistrationController] Seat check warning:', seatErr.message);
    }

    // 3. Generate unique institutional application reference ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationRef = `GNI-APP-2026-${Date.now().toString().slice(-4)}${randomSuffix}`;
    const paymentStatus = 'Pending Offline Payment at Campus';
    const paymentRefVal = (paymentRef && paymentRef.trim()) ? paymentRef.trim() : 'Offline Campus Payment';

    // 4. Insert new registration into MySQL table
    let result = { insertId: Date.now() };

    try {
      const insertQueryWithNewCols = `
        INSERT INTO \`registrations\` (
          \`full_name\`,
          \`email\`,
          \`phone\`,
          \`country\`,
          \`country_code\`,
          \`country_dial\`,
          \`full_phone\`,
          \`location\`,
          \`profession\`,
          \`interested_skill\`,
          \`course_duration\`,
          \`course_fee\`,
          \`total_amount\`,
          \`application_ref\`,
          \`payment_status\`,
          \`payment_ref\`,
          \`experience_level\`,
          \`learning_purpose\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const valuesNew = [
        fullName.trim(),
        normalizedEmail,
        phone.trim(),
        country || 'India',
        countryCode || 'IN',
        countryDial || '+91',
        fullPhone || `${countryDial || '+91'} ${phone.trim()}`,
        location.trim(),
        profession.trim(),
        courseTitle,
        validatedDuration,
        trustedFee,
        totalAmount,
        applicationRef,
        paymentStatus,
        paymentRefVal,
        experienceLevel,
        learningPurpose.trim(),
      ];

      const [resQuery] = await pool.execute(insertQueryWithNewCols, valuesNew);
      result = resQuery;
    } catch (insertErr) {
      // Fallback to basic schema if new columns are not yet provisioned in an older database
      console.warn('[Registration Controller] Fallback to legacy columns:', insertErr.message);
      const fallbackQuery = `
        INSERT INTO \`registrations\` (
          \`full_name\`,
          \`email\`,
          \`phone\`,
          \`country\`,
          \`country_code\`,
          \`country_dial\`,
          \`full_phone\`,
          \`location\`,
          \`profession\`,
          \`interested_skill\`,
          \`experience_level\`,
          \`learning_purpose\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const fallbackValues = [
        fullName.trim(),
        normalizedEmail,
        phone.trim(),
        country || 'India',
        countryCode || 'IN',
        countryDial || '+91',
        fullPhone || `${countryDial || '+91'} ${phone.trim()}`,
        location.trim(),
        profession.trim(),
        `${courseTitle} — ${validatedDuration} (${formattedTotal}) [Ref: ${applicationRef}]`,
        experienceLevel,
        learningPurpose.trim(),
      ];
      const [resQueryFallback] = await pool.execute(fallbackQuery, fallbackValues);
      result = resQueryFallback;
    }

    // 4b. Atomically decrement seats_available for this offering
    try {
      await pool.query(
        `UPDATE \`courses\` SET \`seats_available\` = GREATEST(0, \`seats_available\` - 1) WHERE (LOWER(title) LIKE ? OR title = ?) AND is_active = 1`,
        [`%${courseTitle.toLowerCase()}%`, courseTitle]
      );
    } catch (e) {
      console.warn('[RegistrationController] Seat decrement fallback:', e.message);
    }

    // 5. Dispatch real-time confirmation email to customer & alert to admin
    const registrationDetails = {
      applicationRef,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      country: country || 'India',
      countryCode: countryCode || 'IN',
      countryDial: countryDial || '+91',
      fullPhone: fullPhone || `${countryDial || '+91'} ${phone.trim()}`,
      location: location.trim(),
      profession: profession.trim(),
      interestedSkill: courseTitle,
      courseName: courseTitle,
      courseDuration: validatedDuration,
      courseFee: formattedTrustedFee,
      totalAmount: formattedTotal,
      paymentStatus,
      paymentMethod: 'Offline Payment at Campus',
      paymentRef: paymentRefVal,
      experienceLevel,
      learningPurpose: learningPurpose.trim(),
    };

    let emailSent = false;
    let emailStatus = 'pending';
    let emailErrorMessage = null;

    try {
      // Send real-time confirmation email directly to the customer's registered email
      const customerEmailResult = await sendCustomerRegistrationEmail(registrationDetails);
      emailSent = Boolean(customerEmailResult?.success || customerEmailResult?.simulated);
      emailStatus = emailSent ? 'delivered' : 'failed';
      if (!emailSent && customerEmailResult?.error) {
        emailErrorMessage = customerEmailResult.error;
      }
    } catch (mailErr) {
      console.error('[RegistrationController] Customer confirmation email dispatch failed:', mailErr.message);
      emailSent = false;
      emailStatus = 'failed';
      emailErrorMessage = mailErr.message;
    }

    // Send real-time notification alert to Admin in the background
    sendAdminRegistrationAlert(registrationDetails).catch((adminErr) => {
      console.error('[RegistrationController] Background admin alert error:', adminErr.message);
    });

    // Provide tailored status message per Requirement 4
    const responseMessage = emailSent
      ? 'Registration Successful! A confirmation email has been dispatched to your email address.'
      : 'Your registration was successful, but we could not send the confirmation email. Please check your email address or request another confirmation email.';

    return res.status(201).json({
      success: true,
      emailSent,
      emailStatus,
      message: responseMessage,
      data: {
        id: result.insertId,
        applicationRef,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        country: country || 'India',
        courseName: courseTitle,
        interestedSkill: courseTitle,
        courseDuration: validatedDuration,
        courseFee: trustedFee,
        formattedFee: formattedTrustedFee,
        discount: discountAmount,
        formattedDiscount,
        taxes,
        totalAmount,
        formattedTotal,
        paymentStatus,
        paymentMethod: 'Offline Payment at Campus',
        experienceLevel,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Registration Controller Error]', error);
    // Handle MySQL duplicate key error (ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'An application with this email address already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error processing registration. Please try again.',
      error: error.message,
    });
  }
};

export const getRegistrationStatus = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM `registrations`');
    const totalCount = rows[0]?.total || 0;

    return res.status(200).json({
      success: true,
      service: 'Global Nagas Institute MySQL Database API',
      totalRegistered: totalCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registration statistics',
      error: error.message,
    });
  }
};

/**
 * Resend User Registration Confirmation Email (Requirement 4)
 */
export const resendConfirmationEmail = async (req, res) => {
  try {
    const { email, applicationRef } = req.body;

    if (!email && !applicationRef) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a registered email address or an application reference number.',
      });
    }

    const pool = getPool();
    let query = 'SELECT * FROM `registrations` WHERE `email` = ? ORDER BY `id` DESC LIMIT 1';
    let params = [(email || '').trim().toLowerCase()];

    if (applicationRef) {
      query = 'SELECT * FROM `registrations` WHERE `application_ref` = ? LIMIT 1';
      params = [applicationRef.trim()];
    }

    const [rows] = await pool.query(query, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registration record found for the provided details. Please verify your email or application reference.',
      });
    }

    const reg = rows[0];
    const details = {
      applicationRef: reg.application_ref || `GNI-APP-${reg.id}`,
      fullName: reg.full_name,
      email: reg.email,
      phone: reg.phone,
      fullPhone: reg.full_phone || reg.phone,
      country: reg.country || 'India',
      location: reg.location || '',
      profession: reg.profession || 'Applicant',
      interestedSkill: reg.interested_skill || 'Heritage Learning Program',
      courseName: reg.interested_skill || 'Heritage Learning Program',
      courseDuration: reg.course_duration || 'Scheduled Cohort',
      courseFee: reg.course_fee || '₹4,999',
      totalAmount: reg.total_amount || reg.course_fee || '₹4,999',
      paymentStatus: reg.payment_status || 'Pending Offline Payment at Campus',
      paymentMethod: reg.payment_ref || 'Offline Campus Payment',
      paymentRef: reg.payment_ref || 'Offline Campus Payment',
      experienceLevel: reg.experience_level || 'Beginner',
      learningPurpose: reg.learning_purpose || '',
    };

    const emailResult = await sendCustomerRegistrationEmail(details);

    if (emailResult.success || emailResult.simulated) {
      return res.status(200).json({
        success: true,
        message: `Confirmation email successfully dispatched to ${reg.email}.`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Email delivery failed. Please check your email configuration or contact admissions support.',
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error('[ResendConfirmationController] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to resend confirmation email. Please try again later.',
      error: error.message,
    });
  }
};
