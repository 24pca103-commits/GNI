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
      state,
      city,
      profession,
      courseName,
      interestedSkill,
      courseDuration,
      duration,
      experienceLevel,
      learningPurpose,
      paymentRef,
    } = req.body;

    const resolvedLocation = (location && location.trim())
      ? location.trim()
      : [city, state, country].filter(Boolean).join(', ') || 'Not Specified';

    const chosenCourse = (courseName || interestedSkill || '').trim();
    const chosenDuration = (courseDuration || duration || '').trim();

    // Validate presence of required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !resolvedLocation ||
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
    const cleanPhone = phone.trim();

    // 1. One Active Course Rule:
    // A student can only be enrolled in one active course at a time.
    // Before applying for their next course, their current course must be completed (or cancelled/rejected).
    const [activeRows] = await pool.execute(
      `SELECT id, full_name, email, phone, interested_skill, payment_status 
       FROM \`registrations\` 
       WHERE (\`email\` = ? OR \`phone\` = ?) 
         AND \`payment_status\` NOT IN ('Completed', 'Cancelled', 'Rejected') 
       ORDER BY \`id\` DESC LIMIT 1`,
      [normalizedEmail, cleanPhone]
    );

    if (activeRows && activeRows.length > 0) {
      const activeCourseName = activeRows[0].interested_skill || 'an active program';
      return res.status(409).json({
        success: false,
        message: `You already have an active course enrollment in progress ("${activeCourseName}"). You can register for your next course once your current course is completed.`,
      });
    }

    // 2. Duplicate check for exact same course (if not completed)
    const [existingSameCourse] = await pool.execute(
      'SELECT id, email, interested_skill, payment_status FROM `registrations` WHERE `email` = ? AND `interested_skill` = ? LIMIT 1',
      [normalizedEmail, chosenCourse.trim()]
    );

    if (existingSameCourse && existingSameCourse.length > 0 && existingSameCourse[0].payment_status !== 'Completed') {
      return res.status(409).json({
        success: false,
        message: `You have already registered for "${chosenCourse}" with this email address.`,
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
        resolvedLocation.trim(),
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
        resolvedLocation.trim(),
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
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(409).json({
        success: false,
        message: `An application for "${chosenCourse}" with this email address already exists. If you have finished this course, please ensure it is marked completed before re-enrolling.`,
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

/**
 * Check Real-time Registration Status & Eligibility for Email and/or Phone Number
 * Evaluates whether student has an active/ongoing course or is eligible to enroll.
 */
export const checkRegistrationEligibility = async (req, res) => {
  try {
    const rawEmail = req.query.email || req.body?.email || '';
    const rawPhone = req.query.phone || req.body?.phone || '';
    const courseName = req.query.courseName || req.body?.courseName || '';

    const normalizedEmail = String(rawEmail).trim().toLowerCase();
    const cleanPhone = String(rawPhone).replace(/\D/g, '');

    const hasValidEmail = Boolean(normalizedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail));
    const hasValidPhone = Boolean(cleanPhone && cleanPhone.length >= 7);

    if (!hasValidEmail && !hasValidPhone) {
      return res.status(200).json({
        success: true,
        eligible: true,
        message: 'Provide valid email or phone number to check',
      });
    }

    const pool = getPool();
    let whereClauses = [];
    let params = [];

    if (hasValidEmail && hasValidPhone) {
      whereClauses.push('(`email` = ? OR `phone` LIKE ? OR `full_phone` LIKE ?)');
      params.push(normalizedEmail, `%${cleanPhone}`, `%${cleanPhone}`);
    } else if (hasValidEmail) {
      whereClauses.push('`email` = ?');
      params.push(normalizedEmail);
    } else if (hasValidPhone) {
      whereClauses.push('(`phone` LIKE ? OR `full_phone` LIKE ?)');
      params.push(`%${cleanPhone}`, `%${cleanPhone}`);
    }

    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, full_phone, interested_skill, payment_status, created_at 
       FROM \`registrations\` 
       WHERE ${whereClauses.join(' AND ')} 
       ORDER BY \`id\` DESC`,
      params
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        registered: false,
        eligible: true,
        message: hasValidPhone && !hasValidEmail ? 'Phone number is eligible for registration.' : 'Email is eligible for registration.',
      });
    }

    // Check for active enrollment (not Completed, Cancelled, or Rejected)
    const activeReg = rows.find(
      (r) => !['Completed', 'Cancelled', 'Rejected'].includes(r.payment_status)
    );

    if (activeReg) {
      const activeSkill = activeReg.interested_skill || 'an active program';
      const isEmailMatch = hasValidEmail && activeReg.email?.toLowerCase() === normalizedEmail;
      const isPhoneMatch = hasValidPhone && (activeReg.phone?.includes(cleanPhone) || activeReg.full_phone?.includes(cleanPhone));

      let matchedBy = 'email and phone number';
      if (isEmailMatch && !isPhoneMatch) matchedBy = 'email address';
      else if (!isEmailMatch && isPhoneMatch) matchedBy = 'phone number';

      return res.status(200).json({
        success: true,
        registered: true,
        hasActiveCourse: true,
        eligible: false,
        field: isPhoneMatch && !isEmailMatch ? 'phone' : 'email',
        matchedBy,
        activeCourse: activeSkill,
        paymentStatus: activeReg.payment_status,
        message: `This ${matchedBy} already has an active course enrollment in progress ("${activeSkill}"). You can register for your next course once your current course is completed.`,
      });
    }

    // If specific course is passed, check if exact same course was already registered and not completed
    if (courseName && courseName.trim()) {
      const sameCourse = rows.find(
        (r) =>
          r.interested_skill?.trim().toLowerCase() === courseName.trim().toLowerCase() &&
          r.payment_status !== 'Completed'
      );
      if (sameCourse) {
        return res.status(200).json({
          success: true,
          registered: true,
          hasActiveCourse: true,
          eligible: false,
          activeCourse: sameCourse.interested_skill,
          message: `You have already registered for "${sameCourse.interested_skill}" with these details.`,
        });
      }
    }

    // All previous courses are Completed
    const completedList = rows
      .filter((r) => r.payment_status === 'Completed')
      .map((r) => r.interested_skill);

    return res.status(200).json({
      success: true,
      registered: true,
      hasActiveCourse: false,
      eligible: true,
      completedCourses: completedList,
      message: 'Previous course completed. Eligible to enroll in a new course.',
    });
  } catch (error) {
    console.error('[checkRegistrationEligibility Error]', error);
    return res.status(500).json({
      success: false,
      eligible: true,
      message: 'Error verifying registration status',
      error: error.message,
    });
  }
};

// Backward-compatible alias
export const checkEmailEligibility = checkRegistrationEligibility;
