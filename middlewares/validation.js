import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateBookingData,
  validateSearchParams,
  sanitizeString,
} from '../utils/validators.js';

export const validateRegister = (req, res, next) => {
  const { email, phone, password, firstName, lastName } = req.body;
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!phone || !validatePhone(phone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  if (!password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      errors.push(passwordValidation.message);
    }
  }

  if (!firstName || firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body.firstName = sanitizeString(firstName);
  req.body.lastName = sanitizeString(lastName);
  req.body.email = email.toLowerCase().trim();
  req.body.phone = phone.trim();

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body.email = email.toLowerCase().trim();

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required',
    });
  }

  req.body.email = email.toLowerCase().trim();

  next();
};

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({
      success: false,
      message: passwordValidation.message,
    });
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { firstName, lastName, phone } = req.body;
  const errors = [];

  if (firstName && firstName.trim().length === 0) {
    errors.push('First name cannot be empty');
  }

  if (lastName && lastName.trim().length === 0) {
    errors.push('Last name cannot be empty');
  }

  if (phone && !validatePhone(phone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  if (firstName) req.body.firstName = sanitizeString(firstName);
  if (lastName) req.body.lastName = sanitizeString(lastName);
  if (phone) req.body.phone = phone.trim();

  next();
};

export const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword || currentPassword.trim().length === 0) {
    errors.push('Current password is required');
  }

  if (!newPassword) {
    errors.push('New password is required');
  } else {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      errors.push(passwordValidation.message);
    }
  }

  if (currentPassword === newPassword) {
    errors.push('New password must be different from current password');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateSearch = (req, res, next) => {
  const validation = validateSearchParams(req.query);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  next();
};

export const validateBooking = (req, res, next) => {
  const validation = validateBookingData(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
    });
  }

  req.body.passengers = req.body.passengers.map(passenger => ({
    ...passenger,
    name: sanitizeString(passenger.name),
  }));

  next();
};
