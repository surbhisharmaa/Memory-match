// const mongoose = require('mongoose');

// const scoreSchema = mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//   },
//   score: {
//     type: Number,
//     required: true,
//   },
//   moves: {
//     type: Number,
//     required: true,
//   },
// },
//   { timestamps: true }
// );

// const Score = mongoose.model('Score', scoreSchema);

// module.exports = Score;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  moves: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
