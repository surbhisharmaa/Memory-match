import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
// import './Login.css';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('https://memory-match-two.vercel.app/api/users/login', { username, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300"
          >
            Login
          </button>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account? <a href="/register" className="text-blue-500 dark:text-blue-400 hover:underline">Register here</a>
          </p>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
