import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ token, setToken }) => {
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/users/highscore', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHighScore(data.highScore);

        const { data: leaderboardData } = await axios.get('/api/users/leaderboard');
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    navigate('/');
  };

  const handlePlayGame = () => {
    navigate('/game');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <p className="text-xl font-semibold text-blue-600 mb-6">High Score: {highScore}</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Global Leaderboard</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {leaderboard.map((entry, index) => (
            <li key={index} className="text-gray-800">
              {entry.username}: <span className="font-bold text-blue-600">{entry.highScore}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handlePlayGame} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Play Game
          </button>
          <button 
            onClick={handleProfile} 
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Profile
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
