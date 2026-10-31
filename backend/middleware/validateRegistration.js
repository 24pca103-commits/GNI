export const validateRegistration = (req, res, next) => {
  const { fullName, email, mobileNumber, password, confirmPassword } = req.body;
  const errors = {};

  // 1. Full Name validation
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else {
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long.';
    } else if (trimmedName.length > 100) {
      errors.fullName = 'Full name cannot exceed 100 characters.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.fullName = 'Full name can only contain letters, spaces, periods, and hyphens.';
    }
  }

  // 2. Email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  } else if (email.length > 120) {
    errors.email = 'Email address is too long.';
  }

  // 3. Mobile Number validation
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required.';
  } else {
    const cleanPhone = mobileNumber.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.mobileNumber = 'Please enter a valid phone number (7-15 digits, e.g. +91 9876543210).';
    }
  }

  // 4. Password validation
  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (password.length > 128) {
    errors.password = 'Password cannot exceed 128 characters.';
  } else {
    // Check complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      errors.password = 'Password must contain uppercase, lowercase, a number, and a special character.';
    }
  }

  // 5. Confirm Password validation
  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the errors and try again.',
      errors,
    });
  }

  // Sanitized values passed to controller
  req.sanitizedBody = {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    mobileNumber: mobileNumber.replace(/[\s-]/g, ''),
    password,
  };

  next();
};
