# Semaine des Langues - MERN Stack Application

## Overview

A full-stack MERN (MongoDB, Express, React, Node.js) web application for "Semaine des Langues" at Théophile Gautier school. This platform allows students to practice English by reading daily texts aloud, listening to reference audio, and optionally receiving AI-powered feedback on their pronunciation and fluency.

### Key Features

- **Privacy-First Design**: No personal data collection, no sign-up required
- **Simple User Experience**: Direct access to daily sessions without authentication
- **Voice Recording**: Built-in microphone access for student recording
- **Optional AI Feedback**: Integration with OpenAI Whisper and GPT for pronunciation evaluation
- **Admin Dashboard**: Secure admin panel for session management and analytics
- **Anonymous Analytics**: Track participation metrics without storing user identities
- **Mobile-Friendly**: Responsive design optimized for all devices
- **Blue & White Design**: School-appropriate, accessible interface

## Project Structure

```
semaines-de-langues/
├── backend/
│   ├── models/
│   │   ├── Session.js
│   │   ├── Analytics.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── sessionRoutes.js
│   │   ├── recordingRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   │   ├── sessionController.js
│   │   ├── recordingController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UserSession.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/
│   │   │   ├── AudioRecorder.js
│   │   │   ├── SessionManager.js
│   │   │   └── AnalyticsDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── UserSession.css
│   │   │   ├── AudioRecorder.css
│   │   │   ├── AdminLogin.css
│   │   │   ├── AdminDashboard.css
│   │   │   ├── SessionManager.css
│   │   │   └── AnalyticsDashboard.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── App.js
│   └── package.json
└── README.md
```

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **OpenAI API** - Whisper (transcription) & GPT (feedback)
- **Multer** - File upload handling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - JavaScript library for UI
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Custom styling (blue/white palette)
- **Web Audio API** - Microphone recording

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or remote instance)
- **OpenAI API Key** (for AI feedback feature)

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd semaines-de-langues
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and configure:
# - MONGODB_URI: Your MongoDB connection string
# - OPENAI_API_KEY: Your OpenAI API key
# - JWT_SECRET: A secure random string
# - PORT: 5000 (default)
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env file (optional, API URL defaults to http://localhost:5000/api)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
pnpm dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm start
```
Frontend runs on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
pnpm start
```

**Frontend:**
```bash
cd frontend
pnpm build
pnpm install -g serve
serve -s build -p 3000
```

## Database Setup

### Seed Initial Data

```bash
cd backend
pnpm seed
```

This creates:
- Default admin user: `username: admin` | `password: password123`
- Sample sessions for testing (March 20-23, 2026)

**⚠️ IMPORTANT**: Change the default admin password in production!

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/semaines-de-langues
PORT=5000
JWT_SECRET=your_secure_random_string
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-... (optional)
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Public Routes

#### Get Today's Session
```
GET /api/session/today
Response: { success: true, session: {...}, message: "..." }
```

#### Get Session by Date
```
GET /api/session/:date
Parameter: date (YYYY-MM-DD)
Response: { success: true, session: {...} }
```

#### Submit Recording
```
POST /api/recording/submit
Body: {
  audioData: "base64-audio",
  wantsFeedback: boolean,
  hasConsent: boolean,
  sessionId: "...",
  sessionDate: "...",
  expectedText: "..."
}
Response: { success: true, feedback: {...}, message: "..." }
```

#### Track Analytics Event
```
POST /api/analytics/event
Body: { eventType: "click|attempt|recording_submit|ai_requested|ai_completed", sessionDate: "..." }
```

### Admin Routes (Require JWT Token)

#### Admin Login
```
POST /api/admin/login
Body: { username: "...", password: "..." }
Response: { success: true, token: "..." }
```

#### Get All Sessions
```
GET /api/admin/sessions
Headers: Authorization: Bearer <token>
```

#### Create Session
```
POST /api/admin/sessions
Headers: Authorization: Bearer <token>
Body: { title: "...", date: "2026-03-23", scriptText: "...", isActive: true }
```

#### Update Session
```
PUT /api/admin/sessions/:id
Headers: Authorization: Bearer <token>
Body: { title: "...", date: "2026-03-23", scriptText: "...", isActive: true }
```

#### Upload Reference Audio
```
POST /api/admin/sessions/:id/audio
Headers: Authorization: Bearer <token>, Content-Type: multipart/form-data
Body: FormData { audio: File }
```

#### Get Analytics
```
GET /api/admin/analytics
Headers: Authorization: Bearer <token>
Response: { success: true, analytics: {...} }
```

## Date Configuration

The event dates are hardcoded in the backend for consistency:
- **Testing Phase**: March 20-22, 2026
- **Official Event**: March 23-27, 2026
- **Full Range**: March 20-27, 2026 inclusive

To change event dates, modify the date range in [sessionController.js](backend/controllers/sessionController.js):

```javascript
const eventStart = new Date('2026-03-20');
const eventEnd = new Date('2026-03-27');
```

## Color Scheme

The application uses a professional blue and white palette, school-appropriate and accessible:

```css
Primary Blue: #1E3A8A
Medium Blue: #3B82F6
Light Blue: #DBEAFE
White: #FFFFFF
Light Gray: #F3F4F6
```

## AI Feedback System

When a student requests AI feedback:

1. **Audio Recording** → User records their voice
2. **Transcription** → Whisper API transcribes the audio
3. **Evaluation** → GPT-3.5-turbo compares transcription with expected text
4. **Scores** → Returns:
   - Overall Score (0-100)
   - Pronunciation Score (0-100)
   - Fluency Score (0-100)
   - Accuracy Score (0-100)
   - 3 Short encouraging comments

**Realistic Limitations**: The AI evaluates based on transcribed text, not audio features. Pronunciation assessment is approximate.

## Analytics & Privacy

The system tracks **only anonymous metrics**:
- Page clicks (visitors)
- Practice attempts
- Recording submissions
- AI feedback requests/completions
- Daily participation

**NO personal data is stored**:
- No user identities
- No audio files (only processed for transcription, then deleted)
- No tracking cookies
- No login required for users

## File Upload

Audio files are temporarily stored in `/backend/uploads/` during processing and automatically deleted after transcription. Reference audio files uploaded by admins are served via the `/uploads/` endpoint.

## Error Handling

The application handles:
- Microphone access denied
- Empty recordings
- Missing consent for AI feedback
- API failures (Whisper, OpenAI)
- Missing or inactive sessions
- Network errors

User-friendly error messages are displayed for all conditions.

## Deployment

### With Docker

Create a `Dockerfile` in the root:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN npm install
WORKDIR /app/frontend
RUN npm install && npm run build
WORKDIR /app/backend
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t semaines-de-langues .
docker run -p 5000:5000 semaines-de-langues
```

### Cloud Deployment (Vercel/Heroku)

**Backend on Heroku**:
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

**Frontend on Vercel**:
```bash
cd frontend
npm install -g vercel
vercel
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`

### Microphone Access Not Working
- Allow browser microphone permissions
- Use HTTPS in production (microphone requires secure context)

### AI Feedback Fails
- Verify OpenAI API key is valid
- Check API usage limits
- Ensure API key has access

### CORS Errors
- Verify `frontend` and `backend` are correctly configured
- Check that frontend makes requests to correct API URL

## Future Enhancements

- [ ] Multi-language support
- [ ] Leaderboard with anonymous scores
- [ ] Session replay functionality
- [ ] Teacher export reports
- [ ] Support for multiple schools
- [ ] Offline mode for recording
- [ ] Advanced pronunciation analysis
- [ ] Student progress tracking (anonymous)

## License

This project is developed for Théophile Gautier School. All rights reserved.

## Support

For issues or questions, contact the development team.

---

**Last Updated**: March 2026
