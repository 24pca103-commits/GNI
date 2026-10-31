import { User } from '../models/User.js';
import { sendRegistrationNotifications } from '../services/emailService.js';

/**
 * @desc    Register a new student/user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password } = req.sanitizedBody || req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in or use another email.',
        errors: {
          email: 'Email is already registered.',
        },
      });
    }

    // Create new user in MongoDB
    const user = new User({
      fullName,
      email,
      mobileNumber,
      password,
    });

    const savedUser = await user.save();

    // Dispatch real-time emails to customer & admin
    sendRegistrationNotifications({
      fullName: savedUser.fullName,
      email: savedUser.email,
      phone: savedUser.mobileNumber,
      fullPhone: savedUser.mobileNumber,
      location: 'Online / Registered',
      profession: 'Student / Professional',
      interestedSkill: 'Heritage Learning Journey',
      experienceLevel: 'Standard',
      learningPurpose: 'Course Enrollment',
    }).catch((err) => {
      console.error('[Auth Controller] Background email error:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Congratulations! Your registration with Global Nagas Institute was successful.',
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        mobileNumber: savedUser.mobileNumber,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get registration statistics and health check
 * @route   GET /api/auth/status
 * @access  Public
 */
export const getStatus = async (req, res, next) => {
  try {
    const totalRegistered = await User.countDocuments();
    return res.status(200).json({
      success: true,
      status: 'API operational',
      institute: 'Global Nagas Institute',
      stats: {
        totalEnrolled: totalRegistered + 1250, // Base alumni count + dynamic live registrations
        liveRegistrations: totalRegistered,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
