import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import Card from './Card';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom';

const MemoryGame = ({ username, token }) => {
  // console.log(username);
  const symbols = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(1000);
  const [highScore, setHighScore] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    const shuffledCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    fetchHighScore();
  }, []);

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setIsGameCompleted(true);
      handleSaveScore(); // Save score only when game is completed
    }
  }, [matchedCards, cards]);

  const fetchHighScore = async () => {
    try {
      console.log('Fetching high score for username:', username);
      const { data } = await axios.get(`https://memory-match-two.vercel.app/api/users/highscore/${username}`,{
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setHighScore(data.highScore || 0);
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

  const handleCardClick = (index) => {
    if (disableClick || flippedCards.length === 2 || matchedCards.includes(index)) return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      setDisableClick(true);
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[index];

      if (firstCard === secondCard) {
        setMatchedCards((prev) => [...prev, flippedCards[0], index]);
        setScore((prevScore) => prevScore - 5);
      }

      setTimeout(() => {
        setFlippedCards([]);
        setDisableClick(false);
      }, 1000);
    }

    setMoves((prevMoves) => prevMoves + 1);
  };

  const handleSaveScore = async () => {
    if (!isGameCompleted) return; // Ensure that this is only called when the game is completed
      console.log("thisisworking");
    try {
      // Save score
      await axios.post('https://memory-match-two.vercel.app/api/users/save-score', { score, moves }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check and update high score
      if (score > highScore) {
        await axios.put('https://memory-match-two.vercel.app/api/users/update-highscore', { highScore: score }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsHighScore(true);
      }

      fetchHighScore(); // Refresh high score
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const isFlipped = (index) => flippedCards.includes(index) || matchedCards.includes(index);

  const handlePlayAgain = () => {
    const shuffledCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setMatchedCards([]);
    setMoves(0);
    setScore(1000);
    setIsGameCompleted(false);
    setIsHighScore(false); // Reset high score flag for new game
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {isGameCompleted && isHighScore && <ReactConfetti width={width} height={height} />}
      <h1 className="text-3xl font-bold mb-6">Memory Matching Game</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            isFlipped={isFlipped(index)}
            onClick={() => handleCardClick(index)}
            className="w-16 h-16 bg-blue-200 flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105"
          />
        ))}
      </div>
      <div className="text-center mb-6">
        <p className="text-lg font-medium">Moves: {moves}</p>
        <p className="text-lg font-medium">Score: {score}</p>
        <p className="text-lg font-medium">High Score: {highScore}</p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <button 
          onClick={handlePlayAgain} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Play Again
        </button>
        <button 
          onClick={handleGoToDashboard} 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;
