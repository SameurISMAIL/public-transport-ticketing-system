// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');
const Route = require('./models/Route');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Bus.deleteMany({});
    await Route.deleteMany({});

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

    console.log('Database seeded successfully with 100 buses and routes');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();