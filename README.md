# Slanup - Event Discovery MVP

A production-grade MVP for discovering and creating events, built as a full-stack application inspired by [slanup.com](https://www.slanup.com/).

![Slanup](https://img.shields.io/badge/Version-1.0.0-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node](https://img.shields.io/badge/Node-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

## 🚀 Tech Stack

### Frontend
- **React 18** with **TypeScript** - Type-safe UI development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

### Backend
- **Node.js** with **Express** - RESTful API server
- **MongoDB** with **Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
slanup/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   ├── env.example               # Environment variables template
│   ├── models/
│   │   └── Event.js              # MongoDB Event schema
│   ├── controllers/
│   │   └── eventController.js   # Event business logic
│   └── routes/
│       └── eventRoutes.js        # API route definitions
│
└── frontend/
    ├── index.html                # HTML template
    ├── vite.config.ts            # Vite configuration
    ├── tailwind.config.js        # Tailwind CSS config
    ├── tsconfig.json             # TypeScript config
    ├── package.json              # Frontend dependencies
    ├── src/
    │   ├── main.tsx              # React entry point
    │   ├── App.tsx               # Main app component
    │   ├── index.css             # Global styles
    │   ├── api/
    │   │   └── axiosClient.ts   # Axios configuration
    │   ├── pages/
    │   │   ├── Home.tsx          # Event listing page
    │   │   ├── EventDetails.tsx  # Single event view
    │   │   └── CreateEvent.tsx   # Event creation form
    │   └── components/
    │       ├── Navbar.tsx        # Navigation bar
    │       ├── Footer.tsx        # Footer component
    │       ├── EventCard.tsx     # Event card component
    │       └── LoadingSpinner.tsx # Loading indicator
```

## 🎨 Design System

- **Primary Color**: `#0B101B` (Dark Navy)
- **Accent Color**: `#00B2A9` (Teal/Blue)
- **Font**: Inter / Poppins
- **Button Radius**: 12px
- **Animations**: Minimal fade/slide using Framer Motion

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/slanup
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slanup?retryWrites=true&w=majority
```

5. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, for production):
```env
VITE_API_BASE_URL=http://localhost:5000
# For production, use your deployed backend URL
# VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

4. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/events
```

### Endpoints

#### 1. Create Event
```http
POST /api/events
Content-Type: application/json

{
  "title": "Tech Meetup",
  "description": "A gathering of tech enthusiasts",
  "location": "San Francisco, CA",
  "date": "2024-12-25T18:00:00.000Z",
  "maxParticipants": 50,
  "currentParticipants": 0
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "...",
    "title": "Tech Meetup",
    ...
  }
}
```

#### 2. Get All Events
```http
GET /api/events
GET /api/events?location=San Francisco
GET /api/events?date=2024-12-25
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### 3. Get Event by ID
```http
GET /api/events/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    ...
  }
}
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Create a new service on [Render](https://render.com) or [Railway](https://railway.app)
3. Connect your repository
4. Set environment variables:
   - `PORT` (usually auto-assigned)
   - `MONGODB_URI` (your MongoDB Atlas connection string)
5. Deploy!

**Render Example:**
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable:
   - `VITE_API_BASE_URL` = Your deployed backend URL
5. Deploy!

**Note:** Update `axiosClient.ts` with your production backend URL or use environment variables.

## ✨ Features

- ✅ Create, view, and discover events
- ✅ Search and filter events by location and date
- ✅ Responsive mobile-first design
- ✅ Smooth animations with Framer Motion
- ✅ Real-time participant tracking
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Clean, modern UI matching Slanup brand

## 🧠 Challenges & Solutions

### Challenge 1: MongoDB Connection Issues
**Solution:** Implemented graceful error handling to allow the app to run even without a database connection (MVP mode). Added clear connection status logging.

### Challenge 2: Type Safety
**Solution:** Used TypeScript throughout the frontend for type safety, reducing runtime errors and improving developer experience.

### Challenge 3: API Integration
**Solution:** Created a centralized Axios client with interceptors for consistent error handling and request/response transformation.

### Challenge 4: Animation Performance
**Solution:** Used Framer Motion's optimized animations and CSS transforms for smooth 60fps animations without performance hits.

### Challenge 5: Date Handling
**Solution:** Implemented proper date validation (future dates only) and formatted dates consistently across the application using native JavaScript Date API.

## 🤖 AI Assistance

This project was built with assistance from AI (Cursor AI) for:
- Code structure and organization
- TypeScript type definitions
- API endpoint implementation
- Component design patterns
- Styling consistency
- Error handling strategies

## 📝 License

This project is created for the Slanup Full-Stack Internship challenge.

## 👤 Author

Built with ❤️ for Slanup

## 🔗 Links

- [Slanup Website](https://www.slanup.com/)
- Frontend: (Add your Vercel deployment link)
- Backend: (Add your Render/Railway deployment link)

---

**Note**: This is an MVP built for demonstration purposes. For production use, consider adding:
- User authentication
- Real-time updates
- Image uploads
- Email notifications
- Advanced search
- Pagination
- Rate limiting

