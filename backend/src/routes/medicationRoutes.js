const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const authMiddleware = require('../middleware/authMiddleware');

// Get all medications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const medications = await Medication.find({ userId: req.user.id });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create medication
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, dosage, frequency, prescribedDate, endDate, reason, notes } = req.body;
    const medication = await Medication.create({
      userId: req.user.id,
      name,
      dosage,
      frequency,
      prescribedDate,
      endDate,
      reason,
      notes
    });
    res.status(201).json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Log medication intake
router.post('/:id/log', authMiddleware, async (req, res) => {
  try {
    const { time, taken } = req.body;
    const medication = await Medication.findById(req.params.id);
    medication.logs.push({ time, taken, date: new Date() });
    await medication.save();
    res.json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update medication
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(medication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete medication
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Medication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
