# GitHub & Deployment Setup

## 📋 Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `vitaltrack`
3. **Description**: `VitalTrack - Health Tracking Application with 10 Professional Features`
4. **Visibility**: Public (or Private)
5. **Initialize**: Leave unchecked (we already have git)
6. Click "Create repository"

## 🔑 Step 2: Add Remote & Push

Copy the commands from GitHub (they'll look like below) and run in your terminal:

```bash
cd /Users/juliustawiah/Downloads/vitaltrack/Health-tracking

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/vitaltrack.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## ✨ Step 3: Deploy Backend to Heroku

### Option A: Heroku (Recommended)

```bash
# 1. Install Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create vitaltrack-api

# 4. Set environment variables
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

### Option B: Railway.app (Modern & Easy)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your vitaltrack repo
4. Add `MONGODB_URI` and `JWT_SECRET` variables
5. Auto-deploys on push!

## 🎨 Step 4: Deploy Frontend to Vercel

### Option A: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
cd frontend
vercel --prod

# 3. Configure:
#    - Project name: vitaltrack
#    - Framework: Create React App
#    - Build command: npm run build
```

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repo
4. Settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/build`
5. Deploy!

## 🔗 Step 5: Connect Frontend to Backend

After deployment, update frontend `.env.production`:

```bash
cd frontend

# Update API URL to your deployed backend
echo "REACT_APP_API_URL=https://your-backend-domain.com" > .env.production

# Commit and push
git add .env.production
git commit -m "chore: Update API URL for production"
git push origin main
```

## ✅ Verification Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Heroku/Railway
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Frontend can reach backend API
- [ ] Login works in production
- [ ] All features working

## 🔗 Your URLs (After Deployment)

- **Frontend**: `https://vitaltrack.vercel.app` (or Netlify)
- **Backend API**: `https://vitaltrack-api.herokuapp.com` (or Railway)
- **GitHub**: `https://github.com/YOUR_USERNAME/vitaltrack`

## 🚀 Quick Commands Reference

```bash
# View git history
git log --oneline

# Push changes
git add .
git commit -m "Your message"
git push origin main

# View remote
git remote -v

# Check deployment status
heroku apps
vercel projects
```

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| **Push fails** | Run `git pull origin main` first |
| **Heroku error** | Check `heroku logs --tail` |
| **Frontend can't reach backend** | Update `REACT_APP_API_URL` in .env |
| **MongoDB connection fails** | Verify connection string and IP whitelist |

---

**Next Step**: Follow the GitHub setup to push your code!
