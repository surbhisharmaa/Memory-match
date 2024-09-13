import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './Register.css'; 

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('https://memory-match-two.vercel.app/api/users/register', { 
        firstName,
        lastName,
        email,
        username,
        password 
      });
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError('Error registering: ' + errorMessage);
    }
  };

  return (
    // <div className="container">
    //   <div className="card">
    //     <h2 className="cardTitle">Register</h2>
    //     <form>
    //       <input
    //         type="text"
    //         value={firstName}
    //         onChange={(e) => setFirstName(e.target.value)}
    //         placeholder="First Name"
    //         className="inputField"
    //       />
    //       <input
    //         type="text"
    //         value={lastName}
    //         onChange={(e) => setLastName(e.target.value)}
    //         placeholder="Last Name"
    //         className="inputField"
    //       />
    //       <input
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         placeholder="Email"
    //         className="inputField"
    //       />
    //       <input
    //         type="text"
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //         placeholder="Username"
    //         className="inputField"
    //       />
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         placeholder="Password"
    //         className="inputField"
    //       />
    //       <button type="button" onClick={handleRegister} className="submitButton">
    //         Register
    //       </button>
    //       {error && <p className="errorText">{error}</p>}
    //       <p className="link">
    //         Already have an account?
    //         <a href="/">Login here</a>
    //       </p>
    //     </form>
    //   </div>
    // </div>

    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Register</h2>
        <form>
          <div className="mb-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors duration-300"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Already have an account? <a href="/" className="text-blue-500 dark:text-blue-400 hover:underline">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
