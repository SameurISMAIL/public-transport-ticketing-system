// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, formData);
      setMessage('Login successful! Token: ' + res.data.token);
      setError('');
      // Store the token in local storage
      localStorage.setItem('token', res.data.token);
      // Check if the user is an admin
      if (res.data.user.isAdmin) {
        // Redirect to the admin interface
        navigate('/admin');
      } else {
        // Redirect to the booking interface
        navigate('/booking');
      }
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.msg || err.message));
      setMessage('');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;