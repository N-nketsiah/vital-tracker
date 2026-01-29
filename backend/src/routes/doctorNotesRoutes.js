const express = require('express');
const router = express.Router();
const DoctorNote = require('../models/DoctorNote');
const authMiddleware = require('../middleware/authMiddleware');

// Get all doctor notes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await DoctorNote.find({ userId: req.user.id }).sort({ visitDate: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create doctor note
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { doctorName, visitDate, diagnosis, notes, prescription, followUp } = req.body;
    const note = await DoctorNote.create({
      userId: req.user.id,
      doctorName,
      visitDate,
      diagnosis,
      notes,
      prescription,
      followUp
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update doctor note
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await DoctorNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete doctor note
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await DoctorNote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
