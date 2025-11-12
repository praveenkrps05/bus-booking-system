import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { 
  verificationEmailTemplate, 
  passwordResetEmailTemplate 
} from '../utils/emailTemplates.js';

export const register = async (req, res, next) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email or phone already exists' 
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = new User({
      email,
      phone,
      password,
      firstName,
      lastName,
      verificationToken,
    });

    await user.save();

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - Bus Booking System',
      html: verificationEmailTemplate(firstName, verificationUrl),
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully! You can now login.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phone: req.user.phone,
    },
  });
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Password Reset Request - Bus Booking System',
      html: passwordResetEmailTemplate(user.firstName, resetUrl),
    });

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        verified: req.user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};
