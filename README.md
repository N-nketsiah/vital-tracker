#  VitalTrack - Professional Health Tracking Application ✨

A comprehensive, production-ready health tracking application with advanced analytics, secure authentication, and beautiful UI. Built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### ✅ Complete Feature Set
- 🔐 **User Authentication** - Secure registration & login with JWT
- 📊 **Dashboard** - Real-time health metrics and statistics
- 📈 **Analytics & Insights** - Automated health recommendations and trends
- 📝 **Health Entry Management** - Log vital signs and daily metrics
- 📥 **Data Export** - Download reports as CSV or PDF
- 🔔 **Email Notifications** - Health alerts and weekly reports
- ⚙️ **User Settings** - Profile management and preferences
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Ready** - Fully responsive on all devices
- 🛡️ **Security** - Rate limiting, bcrypt hashing, protected routes

## 🚀 Quick Start

### Backend (5 seconds)
```bash
cd backend
npm install
npm start
```

### Frontend (5 seconds)
```bash
cd frontend
npm install
npm start
```

**Access the app at:** http://localhost:3000

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 5 minutes
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built
- **[COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md)** - Feature checklist

## 🔐 Security Features

- JWT authentication with 7-day expiration
- Bcrypt password hashing (10 rounds)
- Rate limiting (100 req/15min, 5 req/15min for auth)
- Protected API endpoints
- User-specific data isolation
- CORS configuration
- Input validation
- Error sanitization

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router (navigation)
- Tailwind CSS (styling)
- Zustand (state management)
- Axios (HTTP client)
- Recharts (data visualization)
- jspdf (PDF generation)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT & bcryptjs
- Nodemailer (email)
- Morgan (logging)
- Rate Limiter

## 📊 Tracked Metrics

- Heart Rate (bpm)
- Blood Pressure (Systolic/Diastolic)
- Weight (kg)
- Sleep (hours)
- Steps
- Water Intake (glasses)
- Mood (1-10 scale)

## 🎯 Key API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Health Data
- `GET /api/health` - Get all entries
- `POST /api/health` - Create entry
- `PUT /api/health/:id` - Update entry
- `DELETE /api/health/:id` - Delete entry

### Analytics
- `GET /api/analytics/stats` - Health statistics
- `GET /api/analytics/insights` - Health insights
- `GET /api/analytics/trends` - Trend analysis

### Export
- `GET /api/export/csv` - Download CSV
- `GET /api/export/pdf` - Download PDF

## 📁 Project Structure

```
Health-tracking/
├── backend/
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, logging, etc.
│   │   ├── services/       # Email service
│   │   └── server.js       # Main server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # UI components
│   │   ├── store/          # State management
│   │   ├── App.js          # Main app
│   │   └── index.css       # Styles
│   └── package.json
├── QUICK_START.md
├── DEPLOYMENT_GUIDE.md
└── README.md
```

## ⚙️ Configuration

### Backend .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitaltrack
JWT_SECRET=your-secret-key
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment Options

### Option 1: Heroku + Vercel
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#heroku)

### Option 2: Railway
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#railway)

### Option 3: Docker
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#docker)

## 📈 Performance

- Optimized database queries
- Rate limiting on API endpoints
- Efficient state management
- Code splitting in React
- Lazy loading ready
- CDN deployment ready

## 🧪 Test Credentials

```
Email: demo@example.com
Password: password123
```

(Create your own account after registration)

## 📞 Support

For detailed documentation, see the markdown files in the root directory:
- Getting started issues → QUICK_START.md
- Deployment help → DEPLOYMENT_GUIDE.md
- Feature overview → IMPLEMENTATION_SUMMARY.md
- Complete checklist → COMPLETION_CHECKLIST.md

## 🔜 Future Enhancements

- Google/Apple health integration
- Wearable device sync
- AI-powered health predictions
- Social features (share progress)
- Mobile native apps
- Doctor integration
- Medication tracking

## 📜 License

MIT License - feel free to use for personal or commercial projects

---

## ✨ What's New?

**All of the following have been implemented:**

✅ Professional user authentication system
✅ Comprehensive health analytics engine
✅ Beautiful, modern UI with Tailwind CSS
✅ Data export to CSV and PDF
✅ Email notification system
✅ Advanced insights and recommendations
✅ Secure API with rate limiting
✅ Complete documentation
✅ Production-ready code
✅ Responsive mobile design

See [COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md) for the full list of implemented features.

---

**Built with ❤️ for your health**

Questions? Check the documentation files or open an issue!

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The app will run on http://localhost:3000

## ?? Screenshots

[Add screenshots here]

##  Roadmap 

- [ ] User authentication
- [ ] Data persistence with backend
- [ ] Wearable device integration
- [ ] AI-powered health insights
- [ ] Mobile app (React Native)
- [ ] Multi-language support

##  Author 

**Your Name**
- Portfolio: [yourportfolio.com]
- LinkedIn: [linkedin.com/in/yourprofile]
- GitHub: [@yourusername]

##  License 

MIT License - feel free to use for your portfolio!