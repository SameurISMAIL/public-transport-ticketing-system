// src/components/Booking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas
import './Booking.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000';

const Booking = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available routes
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/routes`);
        setRoutes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoutes();
  }, []);

  const handleRouteChange = async (e) => {
    const routeId = e.target.value;
    setSelectedRoute(routeId);
    setSelectedSeat(null); // Reset selected seat
    setSelectedTime(null); // Reset selected time
    setTicket(null); // Reset ticket
    setAvailableSeats([]); // Reset available seats
    setBookedSeats([]); // Reset booked seats
    // Fetch available and booked seats for the selected route
    try {
      const res = await axios.get(`${API_BASE_URL}/api/routes/${routeId}/seats`);
      setAvailableSeats(res.data.availableSeats || []);
      setBookedSeats(res.data.bookedSeats || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeat(seat);
  };

  const handleTimeSelection = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleBooking = async () => {
    console.log('Booking ticket for route:', selectedRoute, 'seat:', selectedSeat, 'time:', selectedTime);
    try {
      const payload = {
        routeId: selectedRoute,
        seat: selectedSeat,
        time: selectedTime,
      };
      console.log('Request payload:', payload);
      const res = await axios.post(`${API_BASE_URL}/api/routes/tickets`, payload);
      console.log('Ticket booked:', res.data);
      setTicket(res.data);
      setMessage('Ticket booked successfully!');
      setError('');
      // Update available and booked seats after booking
      setAvailableSeats(availableSeats.filter(s => s !== selectedSeat));
      setBookedSeats([...bookedSeats, selectedSeat]);
    } catch (err) {
      console.error('Error booking ticket:', err);
      setError('Error booking ticket: ' + (err.response?.data?.msg || err.message));
      setMessage('');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Book a Ticket</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="formRoute">
          <Form.Label>Choose Route</Form.Label>
          <Form.Control as="select" onChange={handleRouteChange}>
            <option value="">Select a route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.from} to {route.to}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {selectedRoute && (
          <Form.Group controlId="formTime" className="mt-3">
            <Form.Label>Choose Time</Form.Label>
            <Form.Control as="select" onChange={handleTimeSelection}>
              <option value="">Select a time</option>
              {routes.find(route => route._id === selectedRoute)?.times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
      </Form>
      {(availableSeats.length > 0 || bookedSeats.length > 0) && (
        <div className="mt-4">
          <h3>Available Seats</h3>
          <div className="seats-container">
            {availableSeats.map((seat) => (
              <Button
                key={`available-${seat}`}
                className={`seat ${selectedSeat === seat ? 'selected' : ''}`}
                onClick={() => handleSeatSelection(seat)}
              >
                {seat}
              </Button>
            ))}
            {bookedSeats.map((seat) => (
              <Button
                key={`booked-${seat}`}
                className="seat booked"
                disabled
              >
                {seat}
              </Button>
            ))}
          </div>
        </div>
      )}
      {selectedSeat && selectedTime && (
        <div className="mt-4">
          <Button onClick={handleBooking}>Book Ticket</Button>
        </div>
      )}
      {ticket && (
        <div className="ticket-container mt-4">
          <h3>Your Ticket</h3>
          <p>Ticket Number: {ticket.number}</p>
          <QRCodeCanvas value={`Ticket Number: ${ticket.number}, Route: ${ticket.route.from} to ${ticket.route.to}, Bus: ${ticket.bus.number}, Seat: ${ticket.seat}, Time: ${ticket.time}`} /> {/* Use QRCodeCanvas */}
        </div>
      )}
    </Container>
  );
};

export default Booking;