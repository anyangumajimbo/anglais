# Semaine des Langues - Quick Start Guide

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
pnpm install
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
```

### 2. Install Frontend Dependencies
```bash
cd frontend
pnpm install
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
pnpm dev
```
Runs on http://localhost:5000

### Start Frontend (Terminal 2)
```bash
cd frontend
pnpm start
```
Runs on http://localhost:3000

## Initial Setup

### Seed Sample Data
```bash
cd backend
pnpm seed
```

Creates:
- Admin account: `admin` / `password123`
- Sample sessions for March 20-27, 2026

## Access Points

- **User Interface**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Server**: http://localhost:5000

## Default Admin Credentials

Username: `admin`
Password: `password123`

⚠️ **Change these credentials in production!**

## Environment Configuration

### Backend .env (required)
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key for Whisper & GPT
- `JWT_SECRET`: Random secure string for tokens
- `PORT`: 5000 (default)

### Frontend .env (optional)
- `REACT_APP_API_URL`: API endpoint (default: http://localhost:5000/api)

## Features

✓ Simple user interface (no login required)
✓ Daily text reading sessions
✓ Voice recording with playback
✓ Optional AI feedback
✓ Admin dashboard for content management
✓ Analytics tracking (anonymous)
✓ Mobile-friendly design
✓ Blue/white color scheme

## Key Dates

- Testing: March 20-22, 2026
- Official Event: March 23-27, 2026

Sessions are assigned to dates by admin—no hardcoded dates in the code.

## Support

See [README.md](README.md) for complete documentation.
