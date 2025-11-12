import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  amenities: [String],
}, {
  timestamps: true,
});

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
