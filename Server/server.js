const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Public Transport Ticketing System API');
});

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const routeRoutes = require('./routes/routes');
app.use('/api/routes', routeRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const ticketRoutes = require('./routes/tickets'); // Import tickets route
app.use('/api/tickets', ticketRoutes); // Use tickets route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
