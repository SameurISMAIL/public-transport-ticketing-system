// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const Ticket = require('./models/Ticket');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Bus.deleteMany({});
    await Route.deleteMany({});
    await Ticket.deleteMany({});
    await User.deleteMany({});

    // Create buses and routes
    const buses = [];
    const routes = [];
    const cities = ['Tunis', 'Sousse', 'Monastir', 'Sfax', 'Gabes', 'Bizerte', 'Nabeul', 'Kairouan', 'Tozeur', 'Djerba'];

    for (let i = 1; i <= 100; i++) {
      const bus = new Bus({ number: `Bus-${i}`, seats: 40 });
      await bus.save();
      buses.push(bus);

      const fromCity = cities[Math.floor(Math.random() * cities.length)];
      let toCity;
      do {
        toCity = cities[Math.floor(Math.random() * cities.length)];
      } while (toCity === fromCity);

      const route = new Route({
        from: fromCity,
        to: toCity,
        bus: bus._id,
        availableSeats: Array.from({ length: bus.seats }, (_, i) => `Seat-${i + 1}`),
      });
      await route.save();
      routes.push(route);
    }

    // Insert mock tickets
    const tickets = [];
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      for (let j = 0; j < 3; j++) {
        const seat = `Seat-${j + 1}`;
        const ticket = new Ticket({
          route: route._id,
          bus: route.bus,
          seat,
          number: `TICKET-${i * 3 + j + 1}`,
          qrCode: `QR-${i * 3 + j + 1}`,
        });
        await ticket.save();
        tickets.push(ticket);
      }
    }

    // Insert mock users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, isAdmin: true },
      { name: 'Regular User', email: 'user@example.com', password: hashedPassword, isAdmin: false },
    ]);

    console.log('Database seeded successfully with 100 buses, routes, tickets, and users');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDatabase();