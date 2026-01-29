const express = require('express');
const router = express.Router();
const HealthGoal = require('../models/HealthGoal');
const authMiddleware = require('../middleware/authMiddleware');

// Get all goals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const goals = await HealthGoal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create goal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { goalType, targetValue, unit, deadline } = req.body;
    const goal = await HealthGoal.create({
      userId: req.user.id,
      goalType,
      targetValue,
      unit,
      deadline
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const goal = await HealthGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await HealthGoal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
