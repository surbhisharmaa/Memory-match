const express = require('express');
const User = require('../models/User');
const Score = require('../models/Score');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Register new user
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ firstName, lastName, email, username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id,username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Save user score
router.post('/save-score', authenticateToken, async (req, res) => {
  // const {token} = req.headers.authorization?.split(' ')[1];

  // if (!token) return res.status(401).json({ message: 'Authentication token is required' });

  // const { score } = req.body;

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.id);
  //   if (!user) return res.status(404).json({ message: 'User not found' });

  //   if (score > user.highScore) {
  //     user.highScore = score;
  //     await user.save();
  //   }

  //   const newScore = new Score({ userId: user._id, score });
  //   await newScore.save();

  //   res.status(201).json({ message: 'Score saved', highScore: user.highScore });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }

  const { token } = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  const { score, moves } = req.body;
  const { username } = req.user;
  try {
    const decoded = jwt.verify(token, 'secret_key'); // Verify JWT
    const { username } = decoded;
    const { score, moves } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newScore = new Score({
      username,
      score,
      moves
    });

    await newScore.save(); 
    // await user.updateHighScore(score);
    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }
    res.status(200).json({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving score' });
  }
});






// Get user high score
router.get('/highscore/:username', async (req, res) => {
  // const token = req.headers.authorization?.split(' ')[1];

  // if (!token) return res.status(401).json({ message: 'No token provided' });

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.id);
  //   if (!user) return res.status(404).json({ message: 'User not found' });
  //   res.json({ highScore: user.highScore });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
  try {
    console.log('Fetching high score for username:', req.params.username);
    const highScore = await Score.find({ username: req.params.username })
      .sort({ score: -1 }) 
      .limit(1); 
    if (highScore.length > 0) {
      res.json({ highScore: highScore[0].score });
    } else {
      res.json({ highScore: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching high score' });
  }

});


// Update user high score
router.put('/update-highscore', async (req, res) => {
  const { token } = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  const { highScore } = req.body;
  const { id } = req.user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { highScore } = req.body;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (highScore > user.highScore) {
      user.highScore = highScore;
      await user.save();
    }

    res.status(200).json({ message: 'High score updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ highScore: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile (high score and past scores)
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from headers

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const scores = await Score.find({ userId: user._id }).sort({ createdAt: -1 });

    res.json({
      highScore: user.highScore,
      scores: scores.map(score => ({
        score: score.score,
        moves: score.moves,
        date: score.createdAt, 
      })),
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
