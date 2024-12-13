// clearDatabase.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const Ticket = require('./models/Ticket');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const clearDatabase = async () => {
  try {
    // Clear all collections
    await Bus.deleteMany({});
    await Route.deleteMany({});
    await Ticket.deleteMany({});
    await User.deleteMany({});
    console.log('All collections have been cleared');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

clearDatabase();