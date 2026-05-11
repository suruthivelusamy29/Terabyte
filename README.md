# 🎬 TeraByte — Premium OTT Streaming Platform

A production-level, Netflix-inspired streaming platform with advanced features, cinematic UI, and personalization.

---

## ✨ Features

### 🎯 Core Features
- **Multi-Profile System** — Multiple profiles per account with separate watch history
- **Smart Recommendations** — Based on watch history and preferences
- **Continue Watching** — Resume playback with progress tracking
- **Watchlist** — Add/remove videos to "My List"
- **Trending Algorithm** — Views × recency scoring
- **Search with Live Suggestions** — Real-time search as you type
- **Notifications** — New content alerts, trending updates
- **Like/Dislike & Ratings** — 5-star rating system with reviews
- **Comments** — User reviews on videos

### 🎨 Premium UI/UX
- **Dark Cinematic Theme** — Neon purple/blue accents
- **Glassmorphism Effects** — Frosted glass navbar and dropdowns
- **Skeleton Loaders** — No basic spinners
- **Hover Video Previews** — Auto-play on hover (ready for implementation)
- **Progress Bars on Thumbnails** — Visual continue watching indicators
- **Smooth Animations** — Cubic-bezier transitions
- **Responsive Design** — Mobile, tablet, desktop

### 🔐 Authentication & Security
- JWT authentication with 7-day expiry
- bcrypt password hashing (10 rounds)
- Role-based access control (user/admin)
- Protected routes with auto-redirect
- Token refresh on 401

### 📊 Admin Dashboard
- **Analytics** — Total users, videos, views, reviews
- **Top Videos** — Most viewed content
- **Category Stats** — Views per category
- **User Management** — View/delete users
- **Video Management** — Upload, edit, delete videos
- **Monthly Trends** — View growth charts

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Axios
- Context API
- CSS3 (custom, no frameworks)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- RESTful API

---

## 📁 Project Structure

```
tera/
├── backend/
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js (profiles, watchlist, progress, notifications)
│   │   ├── Video.js (likes, ratings, trending score)
│   │   └── Review.js
│   ├── controllers/
│   │   ├── authController.js (register, login, watchlist, progress)
│   │   ├── videoController.js (CRUD, recommendations, likes, reviews)
│   │   └── adminController.js (stats, analytics)
│   ├── routes/
│   ├── middleware/auth.js (protect, optionalProtect, adminOnly)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx (search, notifications, glassmorphism)
    │   │   ├── VideoCard.jsx (hover effects, progress bar)
    │   │   ├── VideoRow.jsx (horizontal scroll with arrows)
    │   │   └── SkeletonCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx (hero banner, trending, recommendations)
    │   │   ├── Browse.jsx (filters, sorting, pagination)
    │   │   ├── Watch.jsx (video player, reviews, recommendations)
    │   │   ├── Watchlist.jsx
    │   │   ├── History.jsx (continue watching)
    │   │   ├── Profile.jsx
    │   │   └── Admin/
    │   ├── context/AuthContext.jsx
    │   ├── services/api.js
    │   └── index.css (premium dark theme)
    └── ...
```

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
cd tera

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/terabyte
JWT_SECRET=your_super_secret_jwt_key_2024
NODE_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
# Windows
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# Or open MongoDB Compass
```

### 4. Seed Database

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Open browser
http://localhost:5000/api/seed
```

You'll see: `✅ Seeded 16 videos + admin account`

### 5. Start Frontend

```bash
# Terminal 2
cd frontend
npm run dev

# Open
http://localhost:5173
```

---

## 🔑 Login Credentials

**Admin Account**
- Email: `admin@terabyte.com`
- Password: `admin123`

**Create User Account**
- Go to `/register`

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` 🔒
- `PUT /api/auth/profile` 🔒
- `POST /api/auth/watchlist` 🔒
- `POST /api/auth/progress` 🔒
- `GET /api/auth/progress` 🔒
- `GET /api/auth/notifications` 🔒

### Videos
- `GET /api/videos` (search, category, sort, pagination)
- `GET /api/videos/:id`
- `GET /api/videos/featured`
- `GET /api/videos/trending`
- `GET /api/videos/recommendations` 🔒
- `GET /api/videos/search/suggestions`
- `PUT /api/videos/:id/like` 🔒
- `PUT /api/videos/:id/dislike` 🔒
- `POST /api/videos/:id/review` 🔒
- `GET /api/videos/:id/reviews`

### Admin 👑
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/videos`
- `POST /api/admin/videos`
- `PUT /api/admin/videos/:id`
- `DELETE /api/admin/videos/:id`

🔒 = Protected (requires JWT)  
👑 = Admin only

---

## 🎨 UI Features Implemented

✅ Glassmorphism navbar with blur  
✅ Live search with suggestions dropdown  
✅ Notification bell with unread count  
✅ User dropdown with avatar  
✅ Skeleton loaders (no spinners)  
✅ Hover scale animations on cards  
✅ Progress bars on thumbnails  
✅ Watchlist toggle button  
✅ Star ratings display  
✅ Responsive mobile menu  
✅ Neon purple/blue gradient accents  
✅ Smooth cubic-bezier transitions  

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render
```bash
# Push to GitHub
# Connect Render to repo
# Set environment variables in Render dashboard
```

### Database → MongoDB Atlas
- Create cluster at mongodb.com/cloud/atlas
- Update `MONGO_URI` in backend `.env`

---

## 📊 Database Models

**User**
- name, email, password (hashed), role
- watchHistory[], watchlist[], progress[]
- preferences { categories[], language }
- notifications[]

**Video**
- title, description, category, tags[], cast[]
- thumbnail, backdropImage, videoURL, trailerURL
- duration, durationSeconds, views
- likes[], dislikes[], averageRating, totalRatings
- featured, trending, trendingScore
- year, language, maturityRating

**Review**
- userId, videoId, rating (1-5), comment

---

## 🎯 Advanced Features

### Recommendation Engine
- Analyzes user watch history
- Extracts top 3 favorite categories
- Returns highest-rated videos from those categories

### Trending Algorithm
```js
trendingScore = views × (30 - daysSinceUpload)
```

### Progress Tracking
- Saves timestamp + percentage
- Shows progress bar on thumbnails
- Resume playback feature

---

## 🐛 Troubleshooting

**401 Unauthorized**
- Clear localStorage: DevTools → Application → Local Storage → Clear
- Re-login

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

**Port Already in Use**
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env`

---

## 📝 License

MIT

---

## 👨‍💻 Built With

- React 18
- Node.js 20+
- MongoDB 7+
- Express 4
- JWT + bcrypt
- Vite 5

---

**TeraByte** — Premium streaming, reimagined. 🎬✨
