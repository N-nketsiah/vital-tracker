const mongoose = require('mongoose');

const healthEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  heartRate: {
    type: Number,
    min: 40,
    max: 200
  },
  bloodPressureSys: {
    type: Number,
    min: 70,
    max: 200
  },
  bloodPressureDia: {
    type: Number,
    min: 40,
    max: 130
  },
  weight: {
    type: Number,
    min: 20,
    max: 300
  },
  sleep: {
    type: Number,
    min: 0,
    max: 24
  },
  steps: {
    type: Number,
    min: 0
  },
  water: {
    type: Number,
    min: 0,
    max: 10
  },
  mood: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthEntry', healthEntrySchema);