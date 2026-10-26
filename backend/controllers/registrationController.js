import { getPool } from '../config/mysql.js';
import { sendRegistrationNotifications } from '../services/emailService.js';
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

    sendRegistrationNotifications(registrationDetails).catch((err) => {
      console.error('[Registration Controller] Background email error:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Application Submitted Successfully! Welcome to the Heritage Creator journey.',
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
