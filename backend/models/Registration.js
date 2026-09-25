import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
      maxlength: [120, 'Email cannot exceed 120 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[+]?[0-9\s\-()]{7,20}$/,
        'Please provide a valid phone number',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    profession: {
      type: String,
      required: [true, 'Profession is required'],
      trim: true,
      maxlength: [100, 'Profession cannot exceed 100 characters'],
    },
    interestedSkill: {
      type: String,
      required: [true, 'Interested heritage skill is required'],
      enum: {
        values: [
          'Painting',
          'Libi – Language & Epigraphy',
          'Sculpturing & Nagas Metal Art',
          'Heritage Applications',
          'All Four Pillars',
        ],
        message: '{VALUE} is not a valid heritage skill option',
      },
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: '{VALUE} is not a valid experience level',
      },
    },
    learningPurpose: {
      type: String,
      required: [true, 'Reason for learning heritage skills is required'],
      trim: true,
      minlength: [5, 'Purpose must be at least 5 characters'],
      maxlength: [1000, 'Purpose cannot exceed 1000 characters'],
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if provided
registrationSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sanitize password field from JSON responses
registrationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
