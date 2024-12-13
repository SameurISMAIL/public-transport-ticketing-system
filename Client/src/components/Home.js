// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Container, Button } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="home-container mt-5">
      <h1 className="home-title">Welcome to the Public Transport Ticketing System</h1>
      <div className="home-buttons mt-4">
        <Link to="/register">
          <Button variant="primary" className="home-button me-2">Register</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="home-button">Login</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Home;