# TECHNICAL ARCHITECTURE - Semaine des Langues

## System Overview

The Semaine des Langues platform is a full-stack MERN application designed for privacy-first language learning with optional AI feedback.

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browsers                            │
│                 (Mobile & Desktop)                           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS (Production)
                     │ HTTP Localhost (Development)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  React Frontend                              │
│   - User Session Page                                        │
│   - Admin Dashboard                                          │
│   - Audio Recorder Component                                 │
│   - Session Manager                                          │
│   - Analytics Viewer                                         │
└────────────────────┬────────────────────────────────────────┘
                     │ JSON/REST APIs
                     │ Axios HTTP Client
                     │
┌────────────────────▼────────────────────────────────────────┐
│             Node.js/Express Server                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Route Handlers                                       │   │
│  │ - /api/session/* (public)                           │   │
│  │ - /api/recording/* (public)                         │   │
│  │ - /api/analytics/* (public)                         │   │
│  │ - /api/admin/* (protected)                          │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                    │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │ Controllers & Business Logic                         │   │
│  │ - Session queries (by date)                         │   │
│  │ - Recording submission & AI processing             │   │
│  │ - Analytics tracking                               │   │
│  │ - Admin session & user management                  │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                    │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │ Database Models (Mongoose)                           │   │
│  │ - Session                                           │   │
│  │ - Analytics                                         │   │
│  │ - Admin                                             │   │
│  └───────────────────────┬──────────────────────────────┘   │
└────────────────────┬─────────────────────────────────────────┘
                     │ Mongoose ODM
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   MongoDB                                    │
│   ┌──────────────────────────────────────────────────────┐  │
│   │ Collections:                                         │  │
│   │ - sessions (title, date, scriptText, audioUrl)     │  │
│   │ - analytics (eventType, sessionDate, timestamp)    │  │
│   │ - admins (username, passwordHash)                  │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                     
┌──────────────────────────────────────────────────────────────┐
│              External Services                               │
│  ┌────────────────────┐      ┌──────────────────────────┐   │
│  │  OpenAI Whisper    │      │   OpenAI GPT-3.5-turbo  │   │
│  │  (Audio → Text)    │      │   (Feedback Generation) │   │
│  └────────────────────┘      └──────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Session (No AI Feedback)

```
1. User visits http://localhost:3000
2. React fetches GET /api/session/today
3. Backend queries MongoDB for session with date = today
4. Session displayed with:
   - Title
   - Date
   - Script text
   - Reference audio (if uploaded)
   - Recording interface
5. User records voice using Web Audio API
6. User submits recording
7. POST /api/recording/submit with audioData
8. Backend:
   - Tracks analytics event "recording_submit"
   - Returns thank you message
9. Frontend displays: "Thank you for taking part. Check back tomorrow."
```

### User Session (With AI Feedback)

```
1-6. [Same as above]
7. User checks "I want AI feedback"
8. User checks "I consent to provide my audio for AI analysis"
9. User clicks "Submit Recording"
10. POST /api/recording/submit with:
    - audioData (base64 WAV)
    - wantsFeedback: true
    - hasConsent: true
    - sessionId, sessionDate, expectedText
11. Backend (recordingController.submitRecording):
    a. Track analytics event "ai_requested"
    b. Save audio to /uploads/
    c. Call OpenAI Whisper API
       - Input: audio file
       - Output: transcription text
    d. Call OpenAI GPT-3.5-turbo
       - Input: user transcription + expected text
       - Prompt: Evaluate and provide feedback
       - Output: scores and comments
    e. Track analytics event "ai_completed"
    f. Delete audio file from storage
    g. Return: { overallScore, pronunciationScore, fluencyScore, 
                 accuracyScore, comments[] }
12. Frontend displays feedback with scores and 3 encouraging comments
```

### Admin Session Management

```
1. Admin visits http://localhost:3000/admin/login
2. Submits credentials
3. Backend (adminController.login):
   a. Find admin by username
   b. Compare password with bcrypt.compare()
   c. Generate JWT token
   d. Return token
4. Frontend stores token in localStorage
5. All subsequent requests include Authorization: Bearer <token>
6. Admin navigates to dashboard
7. GET /api/admin/sessions:
   a. Verify JWT token (authMiddleware)
   b. Return all sessions from MongoDB
8. Admin creates new session:
   a. POST /api/admin/sessions
   b. Body: { title, date, scriptText, isActive }
   c. Create MongoDB document
   d. Return created session
9. Admin uploads audio:
   a. POST /api/admin/sessions/:id/audio
   b. Multer middleware parses file
   c. Save to /uploads/audio-timestamp.extension
   d. Update session.referenceAudioUrl
   e. Return updated session
10. Frontend displays success message
```

### Analytics Tracking

```
Event Tracking Flow:
1. User visits homepage → Analytics.create({ eventType: 'click' })
2. User tries to record → Analytics.create({ eventType: 'attempt' })
3. User submits recording → Analytics.create({ eventType: 'recording_submit' })
4. User requests AI feedback → Analytics.create({ eventType: 'ai_requested' })
5. AI feedback succeeds → Analytics.create({ eventType: 'ai_completed' })

Analytics Dashboard:
1. Admin clicks Analytics tab
2. GET /api/admin/analytics
3. Backend:
   a. Find all Analytics documents
   b. Group by eventType
   c. Count by date
   d. Calculate participation per day
4. Return aggregated data
5. Frontend displays:
   - Total metrics
   - Weekly stats
   - Daily breakdown table
```

## API Specification

### Public Endpoints (No Authentication)

#### GET /api/session/today
Returns today's session or message

**Response (200)**:
```json
{
  "success": true,
  "session": {
    "_id": "...",
    "title": "Morning Reading",
    "date": "2026-03-23T00:00:00.000Z",
    "scriptText": "Good morning...",
    "referenceAudioUrl": "/uploads/audio-123.mp3"
  },
  "message": null
}
```

**Response (no session)**:
```json
{
  "success": true,
  "session": null,
  "message": "No session is available for today. Please check back later."
}
```

#### GET /api/session/:date
Returns session for specific date (YYYY-MM-DD)

**Parameters**: 
- date: string (YYYY-MM-DD)

**Response**: Same as above

#### POST /api/recording/submit
Submit voice recording for evaluation

**Body**:
```json
{
  "audioData": "data:audio/wav;base64,UklGRi4A...",
  "wantsFeedback": true,
  "hasConsent": true,
  "sessionId": "...",
  "sessionDate": "2026-03-23T00:00:00.000Z",
  "expectedText": "Full script text here..."
}
```

**Response (no feedback)**:
```json
{
  "success": true,
  "message": "Thank you for taking part in today's session. Please check tomorrow for tomorrow's session.",
  "feedback": null
}
```

**Response (with feedback)**:
```json
{
  "success": true,
  "message": "Feedback generated successfully",
  "feedback": {
    "overallScore": 78,
    "pronunciationScore": 75,
    "fluencyScore": 80,
    "accuracyScore": 78,
    "comments": [
      "Good effort and clear reading.",
      "Improve pronunciation of some words.",
      "Try to read more smoothly."
    ]
  },
  "transcription": "User's actual recording transcribed..."
}
```

#### POST /api/analytics/event
Track anonymous event

**Body**:
```json
{
  "eventType": "click|attempt|recording_submit|ai_requested|ai_completed",
  "sessionDate": "2026-03-23T00:00:00.000Z"
}
```

### Protected Endpoints (JWT Required)

#### POST /api/admin/login
Admin authentication

**Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "...",
    "username": "admin"
  }
}
```

#### GET /api/admin/sessions
Get all sessions

**Headers**: Authorization: Bearer <token>

**Response**:
```json
{
  "success": true,
  "sessions": [
    {
      "_id": "...",
      "title": "Session 1",
      "date": "2026-03-23T00:00:00.000Z",
      "scriptText": "...",
      "referenceAudioUrl": "/uploads/...",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### POST /api/admin/sessions
Create new session

**Headers**: Authorization: Bearer <token>

**Body**:
```json
{
  "title": "New Session",
  "date": "2026-03-24",
  "scriptText": "Full text for students to read...",
  "isActive": true
}
```

#### PUT /api/admin/sessions/:id
Update session

**Headers**: Authorization: Bearer <token>

**Body**: Same as POST /api/admin/sessions

#### POST /api/admin/sessions/:id/audio
Upload reference audio

**Headers**: 
- Authorization: Bearer <token>
- Content-Type: multipart/form-data

**Body**: FormData with audio file

#### GET /api/admin/analytics
Get analytics data

**Headers**: Authorization: Bearer <token>

**Response**:
```json
{
  "success": true,
  "analytics": {
    "totalClicks": 456,
    "totalAttempts": 312,
    "totalRecordings": 289,
    "totalAIRequests": 145,
    "totalAICompletions": 139,
    "currentWeekStats": {
      "clicks": 123,
      "attempts": 95,
      "recordings": 87,
      "aiRequests": 45,
      "aiCompletions": 43
    },
    "participationPerDay": {
      "2026-03-23": { "clicks": 120, "attempts": 95, "recordings": 85 },
      "2026-03-24": { "clicks": 156, "attempts": 128, "recordings": 118 }
    }
  }
}
```

## Database Schema

### Session Collection
```javascript
{
  _id: ObjectId,
  title: String,                      // Session name
  date: Date,                         // When session is available
  scriptText: String,                 // Text for students to read
  referenceAudioUrl: String,          // URL to audio file (/uploads/...)
  isActive: Boolean,                  // Visible to students
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// - date (for querying today's session)
// - date: 1
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  eventType: String,                  // 'click', 'attempt', 'recording_submit', 'ai_requested', 'ai_completed'
  sessionDate: Date,                  // Which session date it relates to (optional)
  timestamp: Date                     // When event occurred
}

// Indexes:
// - { eventType: 1, timestamp: 1 }
// - { sessionDate: 1 }
```

### Admin Collection
```javascript
{
  _id: ObjectId,
  username: String,                   // Unique login
  password: String,                   // Bcrypt hashed
  createdAt: Date
}

// Security:
// - Password is hashed before save via pre('save') hook
// - comparePassword() method for authentication
```

## Authentication & Authorization

### JWT Token Flow

```
1. Admin login → Generate JWT with:
   - Payload: { id: admin._id, username: admin.username }
   - Secret: process.env.JWT_SECRET
   - Expiration: 24 hours

2. Store in localStorage (frontend)

3. Attach to requests:
   Authorization: Bearer <token>

4. Verify with authMiddleware:
   - Extract token from header
   - jwt.verify() with secret
   - Attach decoded data to req.admin
   - If invalid: return 401

5. Token expires after 24 hours
   - User must login again
   - No refresh token (simple implementation)
```

## File Storage

### Backend Uploads Directory

```
/backend/uploads/
├── audio-1711180800000.wav    # Temporary (deleted after processing)
├── audio-1711180800001.wav    # Temporary (deleted after processing)
├── audio-1711180800002.mp3    # Reference audio (persistent)
└── ...

Location: Backend root directory
Cleanup: Temporary audio files deleted after Whisper transcription
```

### URL Serving

Reference audio accessible at:
```
http://localhost:5000/uploads/audio-1711180800002.mp3
```

## Security Considerations

### Frontend Security
- JWT stored in localStorage (accessible to XSS)
  - Consider httpOnly cookies in production
- API URL stored in .env
- No sensitive data in React state

### Backend Security
- Password hashing with bcrypt (10 rounds)
- JWT for stateless authentication
- CORS configured (restrict to frontend domain in production)
- Input validation on all endpoints
- Audio files deleted after processing

### Production Hardening
- Use HTTPS only
- Add rate limiting
- Implement CSRF protection
- Set secure headers (Helmet.js)
- Sanitize user inputs
- Add API versioning

```javascript
// Example: Add helmet and rate limiting
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                     // 100 requests per window
}));
```

## Scalability Considerations

### Database
- Add indexes on frequently queried fields
- Use MongoDB Atlas for managed scaling
- Implement pagination for large result sets
- Archive old analytics data

### API Server
- Horizontal scaling with load balancer
- Environment variables for configuration
- Caching for session queries
- Queue system for AI requests

### Frontend
- Code splitting with React.lazy()
- Service workers for offline support
- CDN for static assets
- Compress audio before sending

## Error Handling

### Frontend Error Handling
```javascript
// API errors caught and displayed to user
try {
  const response = await submitRecording(data);
} catch (error) {
  setError(error.response?.data?.message || 'An error occurred');
}
```

### Backend Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

## Deployment Architecture

### Production Stack
```
                    Users (HTTPS)
                        ↓
                  Load Balancer (HTTPS)
                    ↙        ↘
            API Instance 1   API Instance 2   (Node.js + Express)
                    ↘        ↙
                  MongoDB Atlas (Cloud)
                        ↓
                    Redis (Cache) [Optional]
```

### Monitoring
- Application errors: Sentry
- Uptime monitoring: Uptime Robot
- Database backups: MongoDB Atlas
- API analytics: New Relic or DataDog

---

**Last Updated**: March 2026
