// routes/tickets.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const Bus = require('../models/Bus');

// Create a new ticket
router.post('/tickets', async (req, res) => {
  const { routeId, seat, time } = req.body;

  try {
    console.log('Request payload:', req.body);
    const route = await Route.findById(routeId).populate('bus');
    if (!route) {
      return res.status(404).json({ msg: 'Route not found' });
    }

    // Check if the seat is available
    if (!route.availableSeats.includes(seat)) {
      return res.status(400).json({ msg: 'Seat not available' });
    }

    const ticketNumber = `TICKET-${Date.now()}`;
    const qrCode = `Ticket Number: ${ticketNumber}, Route: ${route.from} to ${route.to}, Bus: ${route.bus.number}, Seat: ${seat}, Time: ${time}`;
    const ticket = new Ticket({
      route: route._id,
      bus: route.bus._id,
      seat,
      time,
      number: ticketNumber,
      qrCode: qrCode,
    });

    await ticket.save();

    // Remove the booked seat from availableSeats
    route.availableSeats = route.availableSeats.filter(s => s !== seat);
    await route.save();

    res.json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Verify ticket based on ticket number
router.post('/verify', async (req, res) => {
  const { ticketNumber } = req.body;

  try {
    console.log('Verifying Ticket Number:', ticketNumber);
    const ticket = await Ticket.findOne({ number: ticketNumber });

    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    console.log('Verified Ticket:', ticket);
    res.json(ticket);
  } catch (err) {
    console.error('Error verifying ticket:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;