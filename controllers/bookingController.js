import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Seat from '../models/Seat.js';
import Payment from '../models/Payment.js';
import { sendEmail } from '../config/email.js';
import { 
  bookingConfirmationEmailTemplate, 
  bookingCancellationEmailTemplate 
} from '../utils/emailTemplates.js';

export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { scheduleId, seatIds, passengers, paymentMethod } = req.body;

    if (!scheduleId || !seatIds || !passengers || !paymentMethod) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Schedule, seats, passengers, and payment method are required',
      });
    }

    if (seatIds.length !== passengers.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Number of seats must match number of passengers',
      });
    }

    const schedule = await Schedule.findById(scheduleId)
      .populate('bus')
      .populate('route')
      .session(session);

    if (!schedule) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    if (schedule.availableSeats < seatIds.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available',
      });
    }

    const seats = await Seat.find({
      _id: { $in: seatIds },
      schedule: scheduleId,
    }).session(session);

    if (seats.length !== seatIds.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Invalid seat selection',
      });
    }

    const bookedSeats = seats.filter(seat => seat.isBooked);
    if (bookedSeats.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Some seats are already booked',
      });
    }

    const totalAmount = schedule.price * seatIds.length;

    const booking = new Booking({
      user: req.user._id,
      schedule: scheduleId,
      seats: seatIds,
      passengers,
      totalAmount,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    });

    await booking.save({ session });

    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { 
        isBooked: true, 
        bookedBy: req.user._id,
        booking: booking._id 
      },
      { session }
    );

    schedule.availableSeats -= seatIds.length;
    await schedule.save({ session });

    const payment = new Payment({
      booking: booking._id,
      user: req.user._id,
      amount: totalAmount,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`,
    });

    await payment.save({ session });

    booking.bookingStatus = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save({ session });

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'schedule',
        populate: [
          { path: 'bus' },
          { path: 'route' }
        ]
      })
      .populate('seats');

    await sendEmail({
      to: req.user.email,
      subject: 'Booking Confirmation - Bus Booking System',
      html: bookingConfirmationEmailTemplate(
        req.user.firstName,
        populatedBooking
      ),
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking,
      payment,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate({
        path: 'schedule',
        populate: [
          { path: 'bus' },
          { path: 'route' }
        ]
      })
      .populate('seats');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (status) {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'schedule',
        populate: [
          { path: 'bus' },
          { path: 'route' }
        ]
      })
      .populate('seats')
      .sort({ bookingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBookings: count,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id)
      .populate('schedule')
      .session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.bookingStatus === 'completed') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking',
      });
    }

    const departureDate = new Date(booking.schedule.departureDate);
    const now = new Date();
    const hoursDifference = (departureDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 2) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 2 hours before departure',
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationDate = Date.now();
    booking.cancellationReason = reason || 'User requested cancellation';
    await booking.save({ session });

    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      { 
        isBooked: false, 
        bookedBy: null,
        booking: null 
      },
      { session }
    );

    const schedule = await Schedule.findById(booking.schedule._id).session(session);
    schedule.availableSeats += booking.seats.length;
    await schedule.save({ session });

    if (booking.paymentStatus === 'paid') {
      const refundAmount = hoursDifference >= 24 ? booking.totalAmount : booking.totalAmount * 0.5;

      const payment = await Payment.findOne({ booking: booking._id }).session(session);
      if (payment) {
        payment.status = 'refunded';
        payment.refundAmount = refundAmount;
        payment.refundDate = Date.now();
        await payment.save({ session });
      }

      booking.paymentStatus = 'refunded';
      await booking.save({ session });
    }

    await session.commitTransaction();

    await sendEmail({
      to: req.user.email,
      subject: 'Booking Cancellation - Bus Booking System',
      html: bookingCancellationEmailTemplate(
        req.user.firstName,
        booking
      ),
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getBookingByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const booking = await Booking.findOne({ bookingReference: reference })
      .populate({
        path: 'schedule',
        populate: [
          { path: 'bus' },
          { path: 'route' }
        ]
      })
      .populate('seats');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};
