import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  createBooking,
  getBookingById,
  getAllBookings,
  cancelBooking,
  getBookingByReference,
} from '../controllers/bookingController.js';
import { validateBooking } from '../middlewares/validation.js';

const router = express.Router();

router.post('/', isAuthenticated, validateBooking, createBooking);

router.get('/', isAuthenticated, getAllBookings);

router.get('/reference/:reference', isAuthenticated, getBookingByReference);

router.get('/:id', isAuthenticated, getBookingById);

router.put('/:id/cancel', isAuthenticated, cancelBooking);

export default router;
