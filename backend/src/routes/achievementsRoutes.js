const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const authMiddleware = require('../middleware/authMiddleware');

// Get all achievements
router.get('/', authMiddleware, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id }).sort({ unlockedDate: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock achievement (internal, called by backend)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, badgeIcon, achievementType } = req.body;
    const achievement = await Achievement.create({
      userId: req.user.id,
      title,
      description,
      badgeIcon,
      achievementType
    });
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
