const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morganMiddleware = require('./middleware/logger');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vitaltrack')
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));
app.use('/api/goals', require('./routes/goalsRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/doctor-notes', require('./routes/doctorNotesRoutes'));
app.use('/api/achievements', require('./routes/achievementsRoutes'));
app.use('/api/meals', require('./routes/mealsRoutes'));
app.use('/api/symptoms', require('./routes/symptomsRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'VitalTrack API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/docs`);
});