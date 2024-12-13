// models/Ticket.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  seat: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Ticket', TicketSchema);