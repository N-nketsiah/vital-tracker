const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const HealthEntry = require('../models/HealthEntry');
const User = require('../models/User');

// GET - Health statistics and trends
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await HealthEntry.find({
      userId: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    if (entries.length === 0) {
      return res.json({
        message: 'No data available for the selected period',
        stats: null
      });
    }

    // Calculate statistics
    const stats = {
      period: `${days} days`,
      totalEntries: entries.length,
      heartRate: calculateMetricStats(entries.map(e => e.heartRate).filter(Boolean)),
      bloodPressure: calculateBPStats(entries),
      weight: calculateMetricStats(entries.map(e => e.weight).filter(Boolean)),
      sleep: calculateMetricStats(entries.map(e => e.sleep).filter(Boolean)),
      steps: calculateMetricStats(entries.map(e => e.steps).filter(Boolean)),
      water: calculateMetricStats(entries.map(e => e.water).filter(Boolean)),
      mood: calculateMetricStats(entries.map(e => e.mood).filter(Boolean))
    };

    res.json({ stats, dataPoints: entries.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Health insights and recommendations
router.get('/insights', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const entries = await HealthEntry.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(30);

    if (entries.length === 0) {
      return res.json({
        message: 'No data available for insights',
        insights: []
      });
    }

    const insights = [];

    // Heart rate insights
    const heartRates = entries.map(e => e.heartRate).filter(Boolean);
    if (heartRates.length > 0) {
      const avgHR = heartRates.reduce((a, b) => a + b) / heartRates.length;
      if (avgHR > 100) {
        insights.push({
          type: 'warning',
          category: 'Heart Rate',
          message: `Your average heart rate (${avgHR.toFixed(0)} bpm) is elevated. Consider relaxation techniques.`,
          severity: 'medium'
        });
      } else if (avgHR < 60) {
        insights.push({
          type: 'info',
          category: 'Heart Rate',
          message: `Your average heart rate (${avgHR.toFixed(0)} bpm) is excellent. Keep up the good fitness!`,
          severity: 'low'
        });
      }
    }

    // Sleep insights
    const sleepData = entries.map(e => e.sleep).filter(Boolean);
    if (sleepData.length > 0) {
      const avgSleep = sleepData.reduce((a, b) => a + b) / sleepData.length;
      if (avgSleep < 7) {
        insights.push({
          type: 'warning',
          category: 'Sleep',
          message: `Your average sleep (${avgSleep.toFixed(1)} hours) is below the recommended 7-9 hours.`,
          severity: 'medium'
        });
      }
    }

    // Weight insights
    if (user.height && user.weight) {
      const bmi = calculateBMI(user.weight, user.height);
      insights.push({
        type: 'info',
        category: 'Weight',
        message: `Your BMI is ${bmi.toFixed(1)} (${getBMICategory(bmi)})`,
        severity: 'low'
      });
    }

    // Hydration insights
    const waterData = entries.map(e => e.water).filter(Boolean);
    if (waterData.length > 0) {
      const avgWater = waterData.reduce((a, b) => a + b) / waterData.length;
      if (avgWater < 8) {
        insights.push({
          type: 'info',
          category: 'Hydration',
          message: `You're averaging ${avgWater.toFixed(1)} glasses of water. Aim for 8+ glasses daily.`,
          severity: 'low'
        });
      }
    }

    res.json({
      message: 'Health insights generated',
      insights,
      analysisDate: new Date(),
      dataPoints: entries.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Trend analysis
router.get('/trends', authMiddleware, async (req, res) => {
  try {
    const { days = 30, metric = 'weight' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await HealthEntry.find({
      userId: req.user.id,
      date: { $gte: startDate }
    })
    .sort({ date: 1 })
    .select(`date ${metric}`);

    if (entries.length < 2) {
      return res.json({
        message: 'Insufficient data for trend analysis',
        trend: null
      });
    }

    // Calculate trend direction
    const values = entries.map(e => e[metric]).filter(v => v !== undefined && v !== null);
    if (values.length < 2) {
      return res.json({
        message: 'Insufficient data for trend analysis',
        trend: null
      });
    }

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const change = lastValue - firstValue;
    const changePercent = (change / firstValue) * 100;

    res.json({
      metric,
      period: `${days} days`,
      startValue: firstValue,
      endValue: lastValue,
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2),
      trend: change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable',
      data: entries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function calculateMetricStats(values) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b);
  const avg = sum / values.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];

  return { avg: parseFloat(avg.toFixed(2)), min, max, median, count: values.length };
}

function calculateBPStats(entries) {
  const sys = entries.map(e => e.bloodPressureSys).filter(Boolean);
  const dia = entries.map(e => e.bloodPressureDia).filter(Boolean);

  return {
    systolic: calculateMetricStats(sys),
    diastolic: calculateMetricStats(dia)
  };
}

function calculateBMI(weight, height) {
  return weight / ((height / 100) ** 2);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

module.exports = router;
