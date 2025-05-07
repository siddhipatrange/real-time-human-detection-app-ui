// src/App.js
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import ProhibitedAreaPage from "./components/ProhibitedAreaPage";
import StrictlyProhibitedAreaPage from "./components/StrictlyProhibitedAreaPage";
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  const { user, login, logout } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <Navbar isAuthenticated={!!user} user={user} onLogout={logout} />
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/signin" 
          element={user ? <Navigate to="/dashboard" /> : <SignIn onAuth={login} />}
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <SignUp onAuth={login} />}
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/prohibited-area"
          element={user ? <ProhibitedAreaPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/strictly-prohibited-area"
          element={user ? <StrictlyProhibitedAreaPage /> : <Navigate to="/signin" />}
        />
      </Routes>
      <ScrollToTopButton />
    </>
  );
}

export default App;
