import { User } from '../models/User.js';

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
