import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
      },
    ],
    passengers: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          enum: ['male', 'female', 'other'],
          required: true,
        },
        seatNumber: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    cancellationDate: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    bookingReference: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, bookingStatus: 1 });
bookingSchema.index({ schedule: 1 });
bookingSchema.index({ bookingReference: 1 });

bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
