// src/components/SignIn.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/signin', formData);
      const { token, user } = res.data;
      login({ userData: user, token });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } 
  };

  const handleClose = () => navigate('/');  

  return (
    <div className="modal-overlay">
      <div
        className="card shadow p-4 animate-pop"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fffaf2',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(255, 140, 0, 0.1)',
          position: "relative"
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '2.5rem',
            color: '#ff8c00',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="card-title text-center mb-4">Welcome back!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="text-end mb-2">
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#ff8c00' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign In</button>

          <div className="text-center my-3">
            <span style={{ backgroundColor: '#fffaf2', padding: '0 10px', color: '#888', fontSize: '13px'}}>
              or 
            </span>
          </div>
          <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Sign in with Google
          </button>

        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );

};

export default SignIn;
