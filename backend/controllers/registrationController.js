import { getPool } from '../config/mysql.js';
import { sendRegistrationNotifications } from '../services/emailService.js';

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
      interestedSkill,
      experienceLevel,
      learningPurpose,
    } = req.body;

    // Validate presence of required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !location ||
      !profession ||
      !interestedSkill ||
      !experienceLevel ||
      !learningPurpose
    ) {
      return res.status(400).json({
        success: false,
        message: 'All application fields are required. Please fill in all fields.',
      });
    }

    const pool = getPool();
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check for existing registration with same email using parameterized query
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

    // 2. Insert new registration into MySQL table using parameterized query
    const insertQuery = `
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

    const values = [
      fullName.trim(),
      normalizedEmail,
      phone.trim(),
      country || 'India',
      countryCode || 'IN',
      countryDial || '+91',
      fullPhone || `${countryDial || '+91'} ${phone.trim()}`,
      location.trim(),
      profession.trim(),
      interestedSkill,
      experienceLevel,
      learningPurpose.trim(),
    ];

    const [result] = await pool.execute(insertQuery, values);

    // Dispatch real-time confirmation email to customer & alert to admin (24pca103@anjaconline.org)
    const registrationDetails = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      country: country || 'India',
      countryCode: countryCode || 'IN',
      countryDial: countryDial || '+91',
      fullPhone: fullPhone || `${countryDial || '+91'} ${phone.trim()}`,
      location: location.trim(),
      profession: profession.trim(),
      interestedSkill,
      experienceLevel,
      learningPurpose: learningPurpose.trim(),
    };

    sendRegistrationNotifications(registrationDetails).catch((err) => {
      console.error('[Registration Controller] Background email error:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Registration Successful! Welcome to the Heritage Creator journey.',
      data: {
        id: result.insertId,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        country: country || 'India',
        interestedSkill,
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
