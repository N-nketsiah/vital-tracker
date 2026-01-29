const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: String,
  frequency: {
    type: String,
    enum: ['once daily', 'twice daily', 'three times daily', 'as needed'],
    required: true
  },
  prescribedDate: Date,
  endDate: Date,
  reason: String,
  notes: String,
  active: {
    type: Boolean,
    default: true
  },
  logs: [{
    date: { type: Date, default: Date.now },
    time: String,
    taken: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medication', medicationSchema);
