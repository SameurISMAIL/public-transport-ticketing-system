// routes/admin.js
const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// Fetch all buses
router.get('/buses', auth, adminAuth, async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new bus
router.post('/buses', auth, adminAuth, async (req, res) => {
  try {
    const { number, seats } = req.body;
    const bus = new Bus({ number, seats });
    await bus.save();
    res.json(bus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove a bus
router.delete('/buses/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await Bus.findByIdAndDelete(id);
    res.json({ msg: 'Bus removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all routes
router.get('/routes', auth, adminAuth, async (req, res) => {
  try {
    const routes = await Route.find().populate('bus');
    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new route
router.post('/routes', auth, adminAuth, async (req, res) => {
  try {
    const { from, to, busId, availableSeats } = req.body;
    const route = new Route({ from, to, bus: busId, availableSeats });
    await route.save();
    res.json(route);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove a route
router.delete('/routes/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await Route.findByIdAndDelete(id);
    res.json({ msg: 'Route removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all tickets
router.get('/tickets', auth, adminAuth, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('route bus');
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new user
router.post('/users', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove a user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch most used buses
router.get('/stats/most-used-buses', auth, adminAuth, async (req, res) => {
  try {
    const mostUsedBuses = await Ticket.aggregate([
      { $group: { _id: "$bus", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "buses", localField: "_id", foreignField: "_id", as: "bus" } },
      { $unwind: "$bus" }
    ]);
    res.json(mostUsedBuses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch most popular destinations
router.get('/stats/most-popular-destinations', auth, adminAuth, async (req, res) => {
  try {
    const mostPopularDestinations = await Route.aggregate([
      { $group: { _id: "$to", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(mostPopularDestinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;