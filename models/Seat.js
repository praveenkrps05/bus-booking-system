import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    seatType: {
      type: String,
      enum: ['window', 'aisle', 'middle'],
      default: 'middle',
    },
  },
  {
    timestamps: true,
  }
);

seatSchema.index({ schedule: 1, seatNumber: 1 }, { unique: true });
seatSchema.index({ schedule: 1, isBooked: 1 });

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
