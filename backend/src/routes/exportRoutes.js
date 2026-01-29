const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const HealthEntry = require('../models/HealthEntry');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// GET - Export health data as CSV
router.get('/csv', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const entries = await HealthEntry.find(query).sort({ date: -1 });

    if (entries.length === 0) {
      return res.status(404).json({ error: 'No health entries found' });
    }

    // Create CSV header
    const headers = [
      'Date',
      'Heart Rate (bpm)',
      'Blood Pressure (Sys/Dia)',
      'Weight (kg)',
      'Sleep (hours)',
      'Steps',
      'Water (glasses)',
      'Mood (1-10)'
    ];

    // Create CSV rows
    const rows = entries.map(entry => [
      entry.date.toISOString().split('T')[0],
      entry.heartRate || '',
      entry.bloodPressureSys && entry.bloodPressureDia ? `${entry.bloodPressureSys}/${entry.bloodPressureDia}` : '',
      entry.weight || '',
      entry.sleep || '',
      entry.steps || '',
      entry.water || '',
      entry.mood || ''
    ]);

    // Combine headers and rows
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="health-data-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Export health report as PDF
router.get('/pdf', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await HealthEntry.find({
      userId: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    // Create PDF
    const doc = new PDFDocument();
    const fileName = `VitalTrack-Report-${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('VitalTrack Health Report', { align: 'center' });
    doc.moveDown();

    // Report date and user info
    doc.fontSize(12).font('Helvetica');
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'left' });
    doc.text(`User: ${user.name}`, { align: 'left' });
    doc.text(`Period: Last ${days} days`, { align: 'left' });
    doc.moveDown();

    // User profile section
    doc.fontSize(14).font('Helvetica-Bold').text('User Profile');
    doc.fontSize(11).font('Helvetica');
    if (user.age) doc.text(`Age: ${user.age} years`);
    if (user.height) doc.text(`Height: ${user.height} cm`);
    if (user.weight) doc.text(`Weight: ${user.weight} kg`);
    if (user.weight && user.height) {
      const bmi = user.weight / ((user.height / 100) ** 2);
      doc.text(`BMI: ${bmi.toFixed(1)}`);
    }
    doc.moveDown();

    // Statistics section
    if (entries.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Health Statistics');
      doc.fontSize(11).font('Helvetica');

      const heartRates = entries.map(e => e.heartRate).filter(Boolean);
      if (heartRates.length > 0) {
        const avgHR = heartRates.reduce((a, b) => a + b) / heartRates.length;
        doc.text(`Average Heart Rate: ${avgHR.toFixed(0)} bpm`);
      }

      const weights = entries.map(e => e.weight).filter(Boolean);
      if (weights.length > 0) {
        const avgW = weights.reduce((a, b) => a + b) / weights.length;
        doc.text(`Average Weight: ${avgW.toFixed(1)} kg`);
      }

      const sleepData = entries.map(e => e.sleep).filter(Boolean);
      if (sleepData.length > 0) {
        const avgSleep = sleepData.reduce((a, b) => a + b) / sleepData.length;
        doc.text(`Average Sleep: ${avgSleep.toFixed(1)} hours`);
      }

      const stepsData = entries.map(e => e.steps).filter(Boolean);
      if (stepsData.length > 0) {
        const avgSteps = stepsData.reduce((a, b) => a + b) / stepsData.length;
        doc.text(`Average Steps: ${avgSteps.toFixed(0)}`);
      }
    }

    doc.moveDown();

    // Recent entries
    doc.fontSize(14).font('Helvetica-Bold').text('Recent Entries');
    doc.fontSize(10).font('Helvetica');

    entries.slice(0, 10).forEach(entry => {
      const dateStr = entry.date.toLocaleDateString();
      doc.text(`${dateStr} - HR: ${entry.heartRate || '-'} bpm, Weight: ${entry.weight || '-'} kg, Sleep: ${entry.sleep || '-'} h`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Export summary report
router.post('/summary', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { days = 30, includeInsights = true } = req.body;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await HealthEntry.find({
      userId: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    const summary = {
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender
      },
      period: `${days} days`,
      reportDate: new Date(),
      totalEntries: entries.length,
      metrics: {}
    };

    // Calculate metrics
    const metrics = ['heartRate', 'weight', 'sleep', 'steps', 'water', 'mood'];
    metrics.forEach(metric => {
      const values = entries.map(e => e[metric]).filter(Boolean);
      if (values.length > 0) {
        summary.metrics[metric] = {
          average: parseFloat((values.reduce((a, b) => a + b) / values.length).toFixed(2)),
          min: Math.min(...values),
          max: Math.max(...values),
          dataPoints: values.length
        };
      }
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
