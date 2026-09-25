import Registration from '../models/Registration.js';

export const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      profession,
      interestedSkill,
      experienceLevel,
      learningPurpose,
      password,
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

    // Check for existing user with same email
    const normalizedEmail = email.toLowerCase().trim();
    const existingRegistration = await Registration.findOne({ email: normalizedEmail });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'An application with this email address already exists. Please use another email or contact support.',
      });
    }

    // Create and save new registration
    const newRegistration = new Registration({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      location: location.trim(),
      profession: profession.trim(),
      interestedSkill,
      experienceLevel,
      learningPurpose: learningPurpose.trim(),
      password: password || null,
    });

    await newRegistration.save();

    return res.status(201).json({
      success: true,
      message: 'Registration Successful! Welcome to the Heritage Creator journey.',
      data: {
        id: newRegistration._id,
        fullName: newRegistration.fullName,
        email: newRegistration.email,
        interestedSkill: newRegistration.interestedSkill,
        experienceLevel: newRegistration.experienceLevel,
        createdAt: newRegistration.createdAt,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }
    next(error);
  }
};

export const getRegistrationStatus = async (req, res) => {
  try {
    const totalCount = await Registration.countDocuments();
    return res.status(200).json({
      success: true,
      service: 'Artisan Coach Heritage Framework API',
      totalRegistered: totalCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registration statistics',
    });
  }
};
