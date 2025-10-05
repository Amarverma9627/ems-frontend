import React, { useState } from 'react';
import { signup } from '../../services/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await signup({ username, password });
      setMessage('Signup successful! You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setMessage('Signup failed. Username may already be taken.');
    }
  };

  return (
    <div className="auth-container">
      <div className="back-arrow" onClick={() => navigate(-1)} title="Back to previous page">&#8592;</div>
      <h2>Signup</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        <button type="submit" className="auth-button">Signup</button>
      </form>
      <p className="signin-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}

export default Signup;
