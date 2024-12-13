// models/Route.js
const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  availableSeats: {
    type: [String],
    required: true,
  },
  times: {
    type: [String], // Array of departure times
    required: true,
  },
});

module.exports = mongoose.model('Route', RouteSchema);