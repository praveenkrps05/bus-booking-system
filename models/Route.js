import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  stops: [{
    name: String,
    arrivalTime: Date,
    departureTime: Date,
  }],
  distance: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, 
    required: true,
  },
}, {
  timestamps: true,
});

const Route = mongoose.model('Route', routeSchema);

export default Route;
