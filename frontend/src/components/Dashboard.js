// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Greeting Section */}
      <div className="text-center mb-5">
        <h1 className="title" style={{color: '#d32f2f'}}>Hello, {user?.name}!</h1>
        <p className="subtitle">Choose the type of area you want to monitor</p>
      </div>

      {/* Divided Section */}
      <div
        className="row"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Prohibited Area Card */}
        <div
          style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '500px',
            backgroundColor: '#fffaf2',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 6px 12px rgba(255, 140, 0, 0.1)',
          }}
        >
          <h3 style={{ color: '#ff8c00', textAlign: 'center'}}>Prohibited Area</h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
            <li>Standard surveillance zones</li>
            <li>Moderate risk level</li>
            <li>Real-time activity detection enabled</li>
          </ul>
          <button
            className="submit-button mt-3 w-100"
            onClick={() => navigate('/prohibited-area')}
          >
            Prohibited Area
          </button>
        </div>

        {/* Strictly Prohibited Area Card */}
        <div
          style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '500px',
            backgroundColor: '#fffaf2',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ color: '#d32f2f', textAlign: 'center'}}>Strictly Prohibited Area</h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
            <li>High-security zones</li>
            <li>Immediate alerts on breach</li>
            <li>Enhanced monitoring protocols</li>
          </ul>
          <button
            className="submit-button mt-3 w-100"
            onClick={() => navigate('/strictly-prohibited-area')}
          >
            Strictly Prohibited Area
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
