// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (value.length < 6) setPasswordStrength('Weak');
      else if (value.length < 10) setPasswordStrength('Moderate');
      else setPasswordStrength('Strong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`;
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', {
        name: fullName,
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = res.data;
      login({ userData: user, token });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } 
  };

  const handleClose = () => navigate('/');

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1rem 2rem 2rem', // push down from top
      }}
    >
      <div
        className="card shadow p-4 animate-pop"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fffaf2',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(255, 140, 0, 0.1)',
          position: "relative",
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

        <h2 className="card-title text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
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

          <div className="mb-2">
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
            <small style={{ color: passwordStrength === 'Weak' ? 'red' : passwordStrength === 'Strong' ? 'green' : '#ff8c00' }}>
              {passwordStrength && `Strength: ${passwordStrength}`}
            </small>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">Create Account</button>

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
            Sign up with Google
          </button>

        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
