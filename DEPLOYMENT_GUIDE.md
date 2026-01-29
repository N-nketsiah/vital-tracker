# VitalTrack - Professional Health Tracking Application

A comprehensive full-stack health tracking application with advanced features for monitoring vital signs, generating insights, and managing health data.

## 🚀 Features Implemented

### Backend (Node.js + Express + MongoDB)
- ✅ **User Authentication & Security**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected API routes
  - Rate limiting on auth endpoints

- ✅ **Health Data Management**
  - Comprehensive health entry model
  - CRUD operations for health metrics
  - Data validation and error handling
  - User-specific data isolation

- ✅ **Analytics & Insights**
  - Health statistics calculation (average, min, max, median)
  - Automated health insights and recommendations
  - Trend analysis for health metrics
  - BMI calculations

- ✅ **Data Export**
  - CSV export of health data
  - PDF report generation with charts
  - Summary export endpoints

- ✅ **Email Notifications**
  - Welcome emails for new users
  - Health alert notifications
  - Weekly health reports
  - Password reset emails

- ✅ **Security & Monitoring**
  - Morgan request logging
  - Express rate limiting
  - Error handling middleware
  - CORS protection

### Frontend (React + Tailwind CSS)
- ✅ **Authentication**
  - Beautiful login/registration pages
  - JWT token management
  - Protected routes
  - Session persistence

- ✅ **Dashboard**
  - Overview with key metrics
  - Health insights display
  - Recent trends visualization
  - Data export functionality

- ✅ **Health Entry Management**
  - Easy-to-use form for adding health data
  - Support for multiple metrics
  - Date-based logging
  - Real-time validation

- ✅ **User Settings**
  - Profile management
  - Password change
  - Notification preferences
  - Data management options

- ✅ **Modern UI**
  - Responsive design
  - Tailwind CSS styling
  - Recharts for data visualization
  - Zustand for state management
  - Smooth animations and transitions

## 📋 Project Structure

```
Health-tracking/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Main server file
│   │   ├── models/
│   │   │   ├── User.js              # User model with authentication
│   │   │   └── HealthEntry.js       # Health data model
│   │   ├── routes/
│   │   │   ├── userRoutes.js        # Auth and profile endpoints
│   │   │   ├── healthRoutes.js      # Health CRUD endpoints
│   │   │   ├── analyticsRoutes.js   # Analytics and insights
│   │   │   └── exportRoutes.js      # Data export endpoints
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification
│   │   │   ├── rateLimiter.js       # Rate limiting
│   │   │   └── logger.js            # Request logging
│   │   └── services/
│   │       └── emailService.js      # Email notifications
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js         # Registration page
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   ├── AddEntry.js         # Add health entry form
│   │   │   └── Settings.js         # User settings
│   │   ├── components/
│   │   │   ├── UI.js              # Reusable components
│   │   │   └── ProtectedRoute.js  # Route protection
│   │   ├── store/
│   │   │   ├── authStore.js       # Auth state management
│   │   │   └── healthStore.js     # Health data state
│   │   ├── App.js                 # Main app with routing
│   │   ├── App.css                # App styles
│   │   └── index.css              # Global styles
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd Health-tracking/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitaltrack
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Email configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

5. **Start the server:**
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd Health-tracking/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server:**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🧪 Testing

### Default Test Credentials
- **Email:** demo@example.com
- **Password:** password123

To create these test credentials:
1. Register a new account with the above credentials
2. Use the app normally

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `PUT /api/users/change-password` - Change password (protected)

### Health Data
- `GET /api/health` - Get all health entries (protected)
- `POST /api/health` - Create health entry (protected)
- `PUT /api/health/:id` - Update entry (protected)
- `DELETE /api/health/:id` - Delete entry (protected)

### Analytics
- `GET /api/analytics/stats?days=30` - Health statistics (protected)
- `GET /api/analytics/insights` - Health insights (protected)
- `GET /api/analytics/trends?metric=weight&days=30` - Trend analysis (protected)

### Export
- `GET /api/export/csv` - Export as CSV (protected)
- `GET /api/export/pdf` - Export as PDF (protected)
- `POST /api/export/summary` - Export summary (protected)

## 🚀 Deployment

### Deploy Backend to Heroku

1. **Install Heroku CLI** and login:
```bash
heroku login
```

2. **Create Heroku app:**
```bash
cd backend
heroku create your-app-name
```

3. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGODB_URI=your-mongodb-uri
```

4. **Deploy:**
```bash
git push heroku main
```

### Deploy Frontend to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Update API URL in environment:**
```bash
REACT_APP_API_URL=https://your-backend-url/api
```

### Deploy to Railway

1. **Create Railway account** at railway.app

2. **Backend deployment:**
   - Connect GitHub repo
   - Select backend folder
   - Add environment variables
   - Deploy

3. **Frontend deployment:**
   - Similar process for frontend
   - Set build command: `npm run build`
   - Set start command: `npm start`

## 🔐 Security Best Practices

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (10 salt rounds)
- Rate limiting on authentication endpoints
- CORS enabled for frontend domain only
- Environment variables for sensitive data
- Input validation on all API endpoints

## 📊 Metrics Tracked

- Heart Rate (bpm)
- Blood Pressure (Systolic/Diastolic)
- Weight (kg)
- Sleep (hours)
- Steps
- Water intake (glasses)
- Mood (1-10 scale)

## 🎯 Future Enhancements

- [ ] Google/Apple health integration
- [ ] Wearable device sync
- [ ] Advanced AI-powered health predictions
- [ ] Social features (share progress)
- [ ] Mobile apps (iOS/Android)
- [ ] Doctor consultations integration
- [ ] Medication tracking
- [ ] Exercise logging with maps

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitaltrack
JWT_SECRET=your-secret-key
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB URI if using Atlas

### API Connection Error
- Check backend is running on port 5000
- Verify CORS is enabled
- Check firewall settings

### Email Not Sending
- Enable "Less secure app access" for Gmail
- Use app-specific password for Gmail
- Check email credentials in `.env`

## 📞 Support

For issues and questions, please refer to the documentation or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Built with ❤️ for your health**
