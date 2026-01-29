# VitalTrack - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Setup
```bash
cd Health-tracking/backend
npm install
npm start
```

Server runs on: **http://localhost:5000**

### Step 2: Frontend Setup
```bash
cd Health-tracking/frontend
npm install
npm start
```

App runs on: **http://localhost:3000**

### Step 3: Create Account or Login
- **Sign Up:** Register with your email and health details
- **Or Use Demo:** email@example.com / password123

## 📊 Key Features

### Dashboard
- View health statistics
- Track trends over time
- Get personalized insights

### Add Health Entry
- Log vital signs (heart rate, blood pressure, weight, etc.)
- Record daily metrics (steps, sleep, water intake, mood)
- Date-based entries for history

### Health Insights
- Automatic recommendations based on your data
- Trend analysis for key metrics
- Health alerts and warnings

### Export & Share
- Download data as CSV
- Generate PDF reports
- Share your progress

## 🔧 Configuration

### Backend .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitaltrack
JWT_SECRET=change-this-to-secure-key
NODE_ENV=development
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Features Overview

✅ User Authentication (Register/Login)
✅ Health Data Management (CRUD)
✅ Health Analytics & Insights
✅ Data Visualization with Charts
✅ Export to CSV & PDF
✅ Email Notifications
✅ Password Management
✅ Responsive Design
✅ Rate Limiting & Security
✅ Request Logging

## 🐛 Common Issues

**Can't connect to MongoDB?**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env

**API not connecting?**
- Check backend is running on port 5000
- Verify CORS is enabled

**Styling not loading?**
- Run `npm install` in frontend folder
- Ensure Tailwind CSS is configured

## 📚 API Examples

### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Add Health Entry
```bash
curl -X POST http://localhost:5000/api/health \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2024-01-29",
    "heartRate": 72,
    "weight": 75.5,
    "sleep": 8,
    "steps": 10000,
    "mood": 8
  }'
```

## 🎯 Next Steps

1. ✅ Set up both backend and frontend
2. ✅ Create your account
3. ✅ Start logging health data
4. ✅ Check insights and trends
5. ✅ Customize settings and preferences

## 🚀 Ready to Deploy?

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Heroku deployment
- Vercel/Netlify setup
- Railway deployment
- Docker containerization

---

**Happy tracking!** 💚📊
