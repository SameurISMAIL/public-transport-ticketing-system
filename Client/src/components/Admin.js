// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000';

const Admin = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [mostUsedBuses, setMostUsedBuses] = useState([]);
  const [mostPopularDestinations, setMostPopularDestinations] = useState([]);
  const [newBus, setNewBus] = useState({ number: '', seats: '' });
  const [newRoute, setNewRoute] = useState({ from: '', to: '', busId: '', availableSeats: [] });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch buses, routes, tickets, users, and stats
    const fetchData = async () => {
      try {
        const busRes = await axios.get(`${API_BASE_URL}/api/admin/buses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const routeRes = await axios.get(`${API_BASE_URL}/api/admin/routes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ticketRes = await axios.get(`${API_BASE_URL}/api/admin/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRes = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mostUsedBusesRes = await axios.get(`${API_BASE_URL}/api/admin/stats/most-used-buses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mostPopularDestinationsRes = await axios.get(`${API_BASE_URL}/api/admin/stats/most-popular-destinations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuses(busRes.data);
        setRoutes(routeRes.data);
        setTickets(ticketRes.data);
        setUsers(userRes.data);
        setMostUsedBuses(mostUsedBusesRes.data);
        setMostPopularDestinations(mostPopularDestinationsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const handleAddBus = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/buses`, newBus, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses([...buses, res.data]);
      setNewBus({ number: '', seats: '' });
      setMessage('Bus added successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add bus.');
      setMessage('');
    }
  };

  const handleRemoveBus = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/buses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(buses.filter(bus => bus._id !== id));
      setMessage('Bus removed successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to remove bus.');
      setMessage('');
    }
  };

  const handleAddRoute = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/routes`, newRoute, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes([...routes, res.data]);
      setNewRoute({ from: '', to: '', busId: '', availableSeats: [] });
      setMessage('Route added successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add route.');
      setMessage('');
    }
  };

  const handleRemoveRoute = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(routes.filter(route => route._id !== id));
      setMessage('Route removed successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to remove route.');
      setMessage('');
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, res.data]);
      setNewUser({ name: '', email: '', password: '' });
      setMessage('User added successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add user.');
      setMessage('');
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== id));
      setMessage('User removed successfully!');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to remove user.');
      setMessage('');
    }
  };

  return (
    <Container className="mt-5">
      <h1>Admin Interface</h1>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="admin-section">
        <h2>Dashboard</h2>
        <div className="dashboard">
          <div className="dashboard-section">
            <h3>Most Used Buses</h3>
            <ul>
              {mostUsedBuses.map(bus => (
                <li key={bus._id}>
                  {bus.bus.number} - {bus.count} uses
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-section">
            <h3>Most Popular Destinations</h3>
            <ul>
              {mostPopularDestinations.map(destination => (
                <li key={destination._id}>
                  {destination._id} - {destination.count} routes
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="admin-section">
        <h2>Buses</h2>
        <Form>
          <Form.Group controlId="formBusNumber">
            <Form.Label>Bus Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Bus Number"
              value={newBus.number}
              onChange={(e) => setNewBus({ ...newBus, number: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formBusSeats" className="mt-3">
            <Form.Label>Seats</Form.Label>
            <Form.Control
              type="number"
              placeholder="Seats"
              value={newBus.seats}
              onChange={(e) => setNewBus({ ...newBus, seats: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddBus} className="mt-3">Add Bus</Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Number</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus._id}>
                <td>{bus.number}</td>
                <td>{bus.seats}</td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveBus(bus._id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="admin-section">
        <h2>Routes</h2>
        <Form>
          <Form.Group controlId="formRouteFrom">
            <Form.Label>From</Form.Label>
            <Form.Control
              type="text"
              placeholder="From"
              value={newRoute.from}
              onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formRouteTo" className="mt-3">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="text"
              placeholder="To"
              value={newRoute.to}
              onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formRouteBusId" className="mt-3">
            <Form.Label>Bus ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Bus ID"
              value={newRoute.busId}
              onChange={(e) => setNewRoute({ ...newRoute, busId: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formRouteSeats" className="mt-3">
            <Form.Label>Available Seats (comma separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Available Seats"
              value={newRoute.availableSeats}
              onChange={(e) => setNewRoute({ ...newRoute, availableSeats: e.target.value.split(',') })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddRoute} className="mt-3">Add Route</Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Bus ID</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route._id}>
                <td>{route.from}</td>
                <td>{route.to}</td>
                <td>{route.bus.number}</td>
                <td>{route.availableSeats.join(', ')}</td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveRoute(route._id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="admin-section">
        <h2>Tickets</h2>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Route</th>
              <th>Bus</th>
              <th>Seat</th>
              <th>Ticket Number</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket.route.from} to {ticket.route.to}</td>
                <td>{ticket.bus.number}</td>
                <td>{ticket.seat}</td>
                <td>{ticket.number}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="admin-section">
        <h2>Users</h2>
        <Form>
          <Form.Group controlId="formUserName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formUserEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formUserPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddUser} className="mt-3">Add User</Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveUser(user._id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Admin;