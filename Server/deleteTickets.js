// deleteTickets.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('./models/Ticket');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const deleteAllTickets = async () => {
  try {
    // Delete all tickets
    await Ticket.deleteMany({});
    console.log('All booked tickets have been deleted');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

deleteAllTickets();