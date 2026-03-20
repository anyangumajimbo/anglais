# 📚 SEMAINE DES LANGUES - DOCUMENTATION INDEX

Welcome to the Semaine des Langues MERN application! This index will help you navigate all documentation and get started quickly.

## 🚀 Quick Start (5 minutes)

Start here if you just want to get the app running:

1. **[QUICKSTART.md](QUICKSTART.md)** ← Start with this!
   - Installation steps
   - Running the application
   - Initial setup
   - Default credentials

## 📖 Full Documentation

### For Everyone
- **[README.md](README.md)** - Complete project overview
  - Technology stack
  - Features
  - Installation & setup
  - API endpoints reference
  - Troubleshooting

### For Administrators
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - How to manage the platform
  - Creating and editing sessions
  - Uploading reference audio
  - Viewing analytics
  - Best practices
  - Troubleshooting common issues

### For Developers
- **[TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)** - System design & architecture
  - Data flow diagrams
  - API specifications
  - Database schemas
  - Security considerations
  - Scalability notes

### For DevOps / Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment options
  - Docker deployment
  - Heroku deployment
  - AWS deployment
  - Cloud platform options
  - SSL/TLS configuration
  - Monitoring & logging

### For Testing
- **[TESTING_VERIFICATION.md](TESTING_VERIFICATION.md)** - Test procedures
  - Setup verification
  - Manual testing workflows
  - Load testing
  - Browser compatibility
  - Pre-launch checklist

## 📁 Project Structure

```
semaines-de-langues/
├── 📄 README.md                          # Main documentation
├── 📄 QUICKSTART.md                      # Quick setup guide
├── 📄 ADMIN_GUIDE.md                     # Admin instructions
├── 📄 TECHNICAL_ARCHITECTURE.md          # System design
├── 📄 DEPLOYMENT.md                      # Deployment guide
├── 📄 TESTING_VERIFICATION.md            # Testing procedures
├── 📄 INDEX.md                           # This file
├── 📄 docker-compose.yml                 # Docker compose config
├── 📄 package.json                       # Root package.json
│
├── backend/                              # Node.js/Express server
│   ├── server.js                         # Entry point
│   ├── package.json                      # Backend dependencies
│   ├── .env.example                      # Environment template
│   ├── Dockerfile                        # Docker config
│   ├── models/                           # MongoDB schemas
│   │   ├── Session.js
│   │   ├── Analytics.js
│   │   └── Admin.js
│   ├── routes/                           # API routes
│   │   ├── sessionRoutes.js
│   │   ├── recordingRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/                      # Business logic
│   │   ├── sessionController.js
│   │   ├── recordingController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── scripts/
│   │   └── seedData.js                   # Database seeding
│   ├── uploads/                          # Audio files (temporary)
│   └── .gitignore
│
└── frontend/                             # React application
    ├── public/
    │   └── index.html                    # HTML entry point
    ├── src/
    │   ├── index.js                      # React entry
    │   ├── index.css                     # Global styles
    │   ├── App.js                        # Root component
    │   ├── pages/                        # Page components
    │   │   ├── UserSession.js            # Main user interface
    │   │   ├── AdminLogin.js             # Admin login
    │   │   └── AdminDashboard.js         # Admin panel
    │   ├── components/                   # Reusable components
    │   │   ├── AudioRecorder.js          # Recording interface
    │   │   ├── SessionManager.js         # Admin session CRUD
    │   │   └── AnalyticsDashboard.js    # Analytics display
    │   ├── services/
    │   │   └── api.js                    # API calls
    │   ├── styles/                       # Component CSS
    │   │   ├── App.css
    │   │   ├── UserSession.css
    │   │   ├── AudioRecorder.css
    │   │   ├── AdminLogin.css
    │   │   ├── AdminDashboard.css
    │   │   ├── SessionManager.css
    │   │   └── AnalyticsDashboard.css
    ├── package.json                      # Frontend dependencies
    ├── .env.example                      # Environment template
    ├── Dockerfile                        # Docker config
    └── .gitignore
```

## 🎯 Common Tasks

### I want to... Get started quickly
→ [QUICKSTART.md](QUICKSTART.md)

### I want to... Understand the system architecture
→ [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)

### I want to... Deploy to production
→ [DEPLOYMENT.md](DEPLOYMENT.md)

### I want to... Manage sessions and content
→ [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

### I want to... Test everything before launch
→ [TESTING_VERIFICATION.md](TESTING_VERIFICATION.md)

### I want to... Check API endpoints
→ [README.md](README.md#api-endpoints) or [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md#api-specification)

### I want to... Fix an issue
→ See [README.md Troubleshooting](README.md#troubleshooting)

## 🔧 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - Object modeling
- **OpenAI API** - Whisper & GPT integration
- **JWT** - Authentication
- **Multer** - File uploads

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling
- **Web Audio API** - Recording

## 🎨 Design System

The application uses a professional blue and white color palette:

```css
Primary Blue: #1E3A8A     /* Primary elements, text *)
Medium Blue: #3B82F6     /* Buttons, interactive elements *)
Light Blue: #DBEAFE      /* Backgrounds, subtle elements *)
White: #FFFFFF           (* Main background *)
Light Gray: #F3F4F6      (* Alternative background *)
```

## 📊 Key Features

✅ **Privacy-First**
- No personal data collection
- No user authentication required
- Anonymous analytics tracking

✅ **Simple User Experience**
- No signup or login for users
- Direct access to daily sessions
- Intuitive interface

✅ **Voice Recording**
- Built-in microphone access
- Real-time recording/playback
- Support for modern browsers

✅ **AI Feedback** (Optional)
- OpenAI Whisper transcription
- GPT-powered evaluation
- Detailed scoring and comments

✅ **Admin Dashboard**
- Secure admin authentication
- Session management (CRUD)
- Audio file uploads
- Anonymous analytics

✅ **Mobile-Friendly**
- Responsive design
- Touch-friendly interface
- Works on all devices

✅ **Fully Documented**
- Complete API documentation
- Deployment guides
- Testing procedures
- Admin instructions

## 📅 Event Dates

**Testing Phase**: March 20-22, 2026
**Official Event**: March 23-27, 2026
**Full Range**: March 20-27, 2026 (inclusive)

Sessions are dynamically assigned to dates—no hardcoded dates in the application logic.

## 🔐 Default Credentials (TESTING ONLY)

Create after running `npm run seed`:
- **Username**: admin
- **Password**: password123

⚠️ **IMPORTANT**: Change these credentials immediately in production!

## 📞 Support & Contact

For questions or issues:
1. Check the relevant documentation guide above
2. Review the [Troubleshooting section](README.md#troubleshooting)
3. Contact the development team

## 🚀 Next Steps

1. **Install & Setup**: Follow [QUICKSTART.md](QUICKSTART.md)
2. **Explore the System**: Read [README.md](README.md)
3. **Test Everything**: Complete [TESTING_VERIFICATION.md](TESTING_VERIFICATION.md)
4. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Manage Content**: Use [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

## 📝 Document Versions

All documentation is current as of **March 2026**.

Last updated: March 20, 2026

---

**Happy coding! 🎉**

For the latest information, refer to the individual documentation files listed above.
