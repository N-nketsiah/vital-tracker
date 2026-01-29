const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const HealthEntry = require('../models/HealthEntry');

// GET all health entries for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await HealthEntry.find({ userId: req.user.id })
      .sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new health entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const entry = new HealthEntry({
      ...req.body,
      userId: req.user.id
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update health entry
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await HealthEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE health entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await HealthEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;