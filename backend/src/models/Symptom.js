const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  symptoms: {
    type: [String],
    required: true
  },
  severity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  description: String,
  duration: String,
  actionTaken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Symptom', symptomSchema);
