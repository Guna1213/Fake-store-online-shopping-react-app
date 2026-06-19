import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();

    if (!trimmedUser) {
      alert("Please enter a valid username.");
      return;
    }

    // Role detection matching logic without Context
    if (trimmedUser === 'Guna2476') {
      if (password === '2006') {
        onLoginSuccess({ username: trimmedUser, role: 'admin' });
        alert("Logged in successfully as Administrator!");
        navigate('/');
      } else {
        alert("Incorrect password for Administrator account.");
      }
    } else {
      // Regular customer user flow
      onLoginSuccess({ username: trimmedUser, role: 'user' });
      alert(`Logged in successfully as Customer: ${trimmedUser}`);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Sign In to FakeStore</h2>
        <p className="login-subtitle">Enter your credentials below to access your account workspace.</p>
        
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type="text" 
            placeholder="Username (e.g., Guna2476)" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">Log In</button>

        <div className="login-hint-box">
          <p>💡 <strong>Quick Access Portals:</strong></p>
          <ul>
            <li><strong>Admin Role:</strong> Username: <code>Guna2476</code> | Password: <code>2006</code></li>
            <li><strong>User Role:</strong> Use any other username and password combination</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default Login;