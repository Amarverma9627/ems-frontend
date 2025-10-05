import { login } from '../../services/AuthService';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../components/auth/Auth.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    try {
      const response = await login(username, password);
      if (response.data && response.data.accessToken) {
        localStorage.setItem('jwtToken', response.data.accessToken);
        window.dispatchEvent(new Event('storage'));
        // alert('Login successful');
        navigate('/employees');
      } else {
        setError('Login failed: No access token received');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  return (
    <div className="auth-container brown-bg">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className='password-wrapper'>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="auth-input"
            autoFocus
          />
        </div>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
       <div className='password-wrapper'>
         <button type="submit" className="auth-button">Login</button>
       </div>
      </form>
      <p className="signup-text">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
