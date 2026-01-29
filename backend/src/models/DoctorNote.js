const mongoose = require('mongoose');

const doctorNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: String,
  visitDate: {
    type: Date,
    required: true
  },
  diagnosis: String,
  notes: {
    type: String,
    required: true
  },
  prescription: String,
  followUp: Date,
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DoctorNote', doctorNoteSchema);
