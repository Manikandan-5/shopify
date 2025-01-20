import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Shophome from './components/Shophome';
import Shoppost from './components/Shoppost';
// import Home from './Home';
// import Post from './Post';

// Simple function to check if the token is valid
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
  return token !== null && token !== '';
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const All = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Shophome/></PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute><Shoppost /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default All;
