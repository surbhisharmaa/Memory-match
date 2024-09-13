import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MemoryGame from './components/MemoryGame';
import Profile from './components/Profile';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };

  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Dashboard token={token} setToken={setToken} /></PrivateRoute>} 
        />
        <Route 
          path="/game" 
          element={<PrivateRoute><MemoryGame token={token} /></PrivateRoute>} 
        />
        <Route 
          path="/profile" 
          element={<PrivateRoute><Profile token={token} /></PrivateRoute>} // Add Profile route
        />
      </Routes>
    //  </Router>
  );
};

export default App;
