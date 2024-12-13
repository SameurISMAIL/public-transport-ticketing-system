// routes/routes.js
const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Ticket = require('../models/Ticket');
const Bus = require('../models/Bus'); // Import the Bus model

// Fetch all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().populate('bus');
    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch available and booked seats for a route
router.get('/:routeId/seats', async (req, res) => {
  try {
    const { routeId } = req.params;
    const route = await Route.findById(routeId).populate('bus');
    if (!route) {
      return res.status(404).json({ msg: 'Route not found' });
    }
    const bookedSeats = await Ticket.find({ route: routeId }).select('seat -_id');
    const bookedSeatNumbers = bookedSeats.map(ticket => ticket.seat);
    res.json({ availableSeats: route.availableSeats, bookedSeats: bookedSeatNumbers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Book a ticket
router.post('/tickets', async (req, res) => {
  try {
    const { routeId, seat } = req.body;
    const route = await Route.findById(routeId).populate('bus');
    if (!route) {
      return res.status(404).json({ msg: 'Route not found' });
    }
    if (!route.availableSeats.includes(seat)) {
      return res.status(400).json({ msg: 'Seat not available' });
    }
    // Remove the seat from available seats
    route.availableSeats = route.availableSeats.filter((s) => s !== seat);
    await route.save();

    const ticket = new Ticket({
      route: routeId,
      bus: route.bus._id,
      seat,
      number: `TICKET-${Date.now()}`,
      qrCode: `TICKET-${Date.now()}`,
    });
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;