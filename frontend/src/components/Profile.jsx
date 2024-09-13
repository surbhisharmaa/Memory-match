import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Profile = ({ token }) => {
  const [profileData, setProfileData] = useState({
    highScore: 0,
    scores: [],
  });
  const [username, setUsername] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      console.log({username});
    } else {
      navigate('/login'); // Redirect to login if no token is present
    }
  }, [navigate]);


  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [token]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Your Profile</h1>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">High Score</h2>
          <p className="text-3xl font-bold text-blue-600">{profileData.highScore}</p>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Your Previous Scores</h3>
          <ul className="list-disc list-inside space-y-2">
            {profileData.scores.length > 0 ? (
              profileData.scores.map((score, index) => (
                <li key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-gray-800">Score: {score.score}</p>
                  <p className="text-md text-gray-600">Moves: {score.moves}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(score.date).toLocaleString()}</p>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No scores available.</p>
            )}
          </ul>
        </div>
        <div className="text-center">
          <button 
            onClick={handleBackToDashboard} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
