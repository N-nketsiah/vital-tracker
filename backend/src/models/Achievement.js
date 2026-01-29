const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  badgeIcon: String,
  achievementType: {
    type: String,
    enum: ['streak', 'milestone', 'consistency'],
    required: true
  },
  unlockedDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: Number,
    target: Number
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
