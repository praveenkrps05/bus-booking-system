import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserBookings,
  deleteAccount,
} from '../controllers/userController.js';
import { validateProfileUpdate, validatePasswordChange } from '../middlewares/validation.js';

const router = express.Router();

router.get('/profile', isAuthenticated, getProfile);

router.put('/profile', isAuthenticated, validateProfileUpdate, updateProfile);

router.put('/change-password', isAuthenticated, validatePasswordChange, changePassword);

router.get('/bookings', isAuthenticated, getUserBookings);

router.delete('/account', isAuthenticated, deleteAccount);

export default router;
