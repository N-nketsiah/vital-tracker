const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');
const authMiddleware = require('../middleware/authMiddleware');

// Get all symptoms
router.get('/', authMiddleware, async (req, res) => {
  try {
    const symptoms = await Symptom.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create symptom entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, symptoms, severity, stressLevel, description, duration, actionTaken } = req.body;
    const symptom = await Symptom.create({
      userId: req.user.id,
      date,
      symptoms,
      severity,
      stressLevel,
      description,
      duration,
      actionTaken
    });
    res.status(201).json(symptom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update symptom entry
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const symptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(symptom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete symptom entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Symptom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Symptom entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
