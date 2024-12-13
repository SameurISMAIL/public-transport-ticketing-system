// src/components/CheckTicket.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Alert } from 'react-bootstrap';
import QrScanner from 'qr-scanner'; // Import QrScanner
import './CheckTicket.css'; // Import the CSS file

const API_BASE_URL = 'http://localhost:5000';

const CheckTicket = () => {
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        console.log('QR Code Result:', result.data); // Print the read information

        // Extract the ticket number from the QR code
        const ticketNumberMatch = result.data.match(/Ticket Number: ([^\s,]+)/);
        if (ticketNumberMatch) {
          const ticketNumber = ticketNumberMatch[1];
          console.log(ticketNumber);

          // Verify the ticket by its number
          const res = await axios.post(`${API_BASE_URL}/api/tickets/verify`, { ticketNumber });
          setTicket(res.data);
          setMessage('Ticket verified successfully!');
          setError('');
        } else {
          setError('Invalid QR code format');
          setMessage('');
        }
      } catch (err) {
        console.error('Error verifying ticket:', err);
        setError('Error verifying ticket: ' + (err.response?.data?.msg || err.message));
        setMessage('');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Check Ticket</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload QR Code Image</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
      </Form.Group>
      {ticket && (
        <div className="ticket-container mt-4">
          <h3>Ticket Details</h3>
          <p>Ticket Number: {ticket.number}</p>
        </div>
      )}
    </Container>
  );
};

export default CheckTicket;