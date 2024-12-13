// models/Bus.js
const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  times: {
    type: [String], // Array of departure times
    required: true,
  },
});

module.exports = mongoose.model('Bus', BusSchema);