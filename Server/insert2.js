// insert2.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Function to generate random times
const generateRandomTimes = (numTimes) => {
  const times = [];
  for (let i = 0; i < numTimes; i++) {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    times.push(time);
  }
  return times;
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Bus.deleteMany({});
    await Route.deleteMany({});
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

      const departureTimes = generateRandomTimes(5); // Generate 5 random departure times

      const route = new Route({
        from: fromCity,
        to: toCity,
        bus: bus._id,
        availableSeats: Array.from({ length: bus.seats }, (_, i) => `Seat-${i + 1}`),
        times: departureTimes, // Add the generated times to the route
      });
      await route.save();
      routes.push(route);
    }

    // Insert mock users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    await User.insertMany([
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, isAdmin: true },
      { name: 'Regular User', email: 'user@example.com', password: hashedPassword, isAdmin: false },
    ]);

    console.log('Database seeded successfully with 100 buses, routes, and users');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();