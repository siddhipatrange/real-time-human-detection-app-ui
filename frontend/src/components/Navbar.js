import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo3.png';
import { toast } from 'react-toastify';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const inHomePage = location.pathname === '/';
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
    toast.info('You have been logged out.');
    navigate('/');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" height="40" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
          aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto">
            {inHomePage ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="#home">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">About</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features">Features</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#publication">Publication</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">Contact</a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/#home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#features">Features</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#publication">Publication</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/#contact">Contact</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <div className="position-relative" ref={dropdownRef}>
                <div className="dropdown d-flex align-items-center">
                  <img
                    src="https://www.gravatar.com/avatar/?d=mp"
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: '32px', height: '32px', objectFit: 'cover', border: '1px solid #ccc' }}
                  />
                  <span
                    className="nav-link dropdown-toggle text-warning"
                    role="button"
                    id="userDropdown"
                    style={{ fontSize: '0.95rem', cursor: 'pointer' }}
                    onClick={toggleDropdown}
                  >
                    {user && user.name}
                  </span>
                </div>
                {showDropdown && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1000,
                    }}
                    aria-labelledby="userDropdown"
                  >
                    <li><button className="dropdown-item text-dark">Your Profile</button></li>
                    <li><button className="dropdown-item text-dark">Settings</button></li>
                    <li><button className="dropdown-item text-dark">Display</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                  </ul>
                )}
              </div>
            ) : (
              <div>
                <Link className="btn btn-outline-primary me-2" to="/signin">Sign In</Link>
                <Link className="btn btn-primary" to="/signup">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
