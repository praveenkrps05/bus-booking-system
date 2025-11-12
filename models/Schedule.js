import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'running', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

scheduleSchema.index({ departureDate: 1, status: 1 });
scheduleSchema.index({ bus: 1, departureDate: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
