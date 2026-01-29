const express = require('express');
const router = express.Router();
const MealEntry = require('../models/MealEntry');
const authMiddleware = require('../middleware/authMiddleware');

// Get all meals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const meals = await MealEntry.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get meals by date
router.get('/date/:date', authMiddleware, async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    
    const meals = await MealEntry.find({
      userId: req.user.id,
      date: { $gte: startDate, $lt: endDate }
    });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create meal entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, mealType, foodItems, notes } = req.body;
    const totalCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
    const totalProtein = foodItems.reduce((sum, item) => sum + (item.protein || 0), 0);
    const totalCarbs = foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0);
    const totalFat = foodItems.reduce((sum, item) => sum + (item.fat || 0), 0);

    const meal = await MealEntry.create({
      userId: req.user.id,
      date,
      mealType,
      foodItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      notes
    });
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update meal entry
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const meal = await MealEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete meal entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await MealEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
