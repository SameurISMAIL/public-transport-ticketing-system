// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Booking from './components/Booking';
import Admin from './components/Admin'; // Import the Admin component
import CheckTicket from './components/CheckTicket'; // Import the CheckTicket component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} /> {/* Add the new route */}
        <Route path="/check-ticket" element={<CheckTicket />} /> {/* Add the CheckTicket route */}
      </Routes>
    </Router>
  );
}

export default App;