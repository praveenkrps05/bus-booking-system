import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../middlewares/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);

router.get('/verify/:token', verifyEmail);

router.post('/login', validateLogin, passport.authenticate('local'), login);

router.post('/logout', isAuthenticated, logout);

router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.post('/reset-password/:token', validateResetPassword, resetPassword);

router.get('/me', isAuthenticated, getCurrentUser);

export default router;
