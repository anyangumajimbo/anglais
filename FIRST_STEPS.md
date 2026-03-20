# 🎯 FIRST STEPS - What to Do Now

Welcome! You now have a complete Semaine des Langues MERN application. Here's exactly what to do next:

## 📍 YOU ARE HERE

This workspace is ready with:
- ✅ Backend (Node.js + Express)
- ✅ Frontend (React)
- ✅ Complete documentation
- ✅ Database models
- ✅ Admin dashboard
- ✅ Audio recording
- ✅ AI feedback integration

## ⏱️ TYPICAL SETUP TIME: 15-20 minutes

## 🔧 YOUR NEXT 5 STEPS

### Step 1: Install Backend (2 min)
```bash
cd backend
pnpm install
```

**Why?** Downloads 50+ packages needed for the server (pnpm is faster than npm!).

**Expected Output:**
```
Progress: resolved XXX, reused XXX, downloaded XXX, added XXX, done
```

### Step 2: Install Frontend (2 min)
```bash
cd frontend
pnpm install
```

**Why?** Downloads React and dependencies.

**Expected Output:**
```
Progress: resolved XXX, reused XXX, downloaded XXX, added XXX, done
```

### Step 3: Configure Backend (3 min)
```bash
cd backend

# Copy template
cp .env.example .env

# Edit with your values (use any text editor)
# nano .env    (on Mac/Linux)
# notepad .env (on Windows)
```

**What to add:**
```
MONGODB_URI=mongodb://localhost:27017/semaines-de-langues
PORT=5000
JWT_SECRET=my-super-secret-key-at-least-32-chars
OPENAI_API_KEY=sk-... (optional - for AI feedback)
NODE_ENV=development
```

**Don't have OpenAI key?** 
- You can skip it for now
- The app will still work (without AI feedback)
- Get one later: https://platform.openai.com/api-keys

### Step 4: Seed Database (1 min)
```bash
cd backend
pnpm seed
```

**Why?** Creates:
- ✅ Admin account (admin / password123)
- ✅ Sample sessions for March 20-27, 2026
- ✅ Ready for testing

**Expected Output:**
```
MongoDB connected
Default admin created - username: admin, password: password123
Sample sessions created
Seed data completed successfully
```

### Step 5: Start Everything (Running now!)

**Open 2 Terminal Windows:**

**Terminal 1 - Backend:**
```bash
cd backend
pnpm dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm start
```

This will open your browser to: **http://localhost:3000**

---

## ✅ VERIFY IT WORKS

### Check 1: Homepage Loads
- [ ] Visit http://localhost:3000
- [ ] See "Semaine des Langues" title
- [ ] See today's session (or appropriate message)

### Check 2: API is Running
- [ ] Open http://localhost:5000/api/health
- [ ] See: `{"status":"ok","timestamp":"..."}`

### Check 3: Admin Login Works
- [ ] Click "Admin Access" at bottom of page
- [ ] Go to http://localhost:3000/admin/login
- [ ] Login: `admin` / `password123`
- [ ] See admin dashboard

### Check 4: Recording Works
- [ ] From homepage, click "Start Recording"
- [ ] Grant microphone permission
- [ ] Speak a few words
- [ ] Click "Stop Recording"
- [ ] Click "Play Recording" to hear yourself

---

## 🎨 Your App is Live!

🎉 **Congratulations!** Your app is running on:

| What | URL |
|------|-----|
| User Interface | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| API Server | http://localhost:5000 |

---

## 📖 READ NEXT

Choose based on your role:

**I want to Get Started →** [QUICKSTART.md](QUICKSTART.md)

**I'm an Administrator →** [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

**I'm a Developer →** [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)

**I need to Deploy →** [DEPLOYMENT.md](DEPLOYMENT.md)

**I need to Test Everything →** [TESTING_VERIFICATION.md](TESTING_VERIFICATION.md)

**Overview of Everything →** [README.md](README.md)

---

## 🛠️ Troubleshooting

### "pnpm: command not found"
→ Install pnpm: `npm install -g pnpm` or `npm i -g pnpm@8`

### "MongoDB connected" error in backend
→ Install MongoDB:
- **Windows**: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt install mongodb`
- Then start MongoDB: `mongod`

### "Cannot find module" errors
→ Make sure you ran `pnpm install` in that directory

### Microphone not working
→ Browser asking for permission? Click "Allow"
→ Already denied? Reset in browser settings and reload

### "OPENAI_API_KEY" error
→ You can skip AI feedback for now
→ Get a key later from: https://platform.openai.com/api-keys

---

## ⏰ Default Event Dates

The app is configured for:
- **Testing**: March 20-22, 2026
- **Official**: March 23-27, 2026

Currently showing sample sessions. On actual event dates, real sessions will appear.

---

## 🚀 Next Milestones

- [ ] System is running locally
- [ ] Read the relevant documentation
- [ ] Complete thorough testing ([TESTING_VERIFICATION.md](TESTING_VERIFICATION.md))
- [ ] Deploy to production ([DEPLOYMENT.md](DEPLOYMENT.md))
- [ ] Launch on March 20, 2026

---

## 💡 Pro Tips

1. **Keep two terminals open** - One for backend, one for frontend
2. **Use Ctrl+C** to stop servers (then start them again if needed)
3. **Check browser console** (F12) if something looks wrong
4. **Admin password** - Change from `password123` before launching!
5. **OpenAI cost** - AI feedback costs ~$0.01-0.05 per request (monitor usage)

---

## 🎓 Understanding the Flow

### User Journey

```
1. Visit http://localhost:3000
2. See today's session
3. Read the text
4. Listen to reference audio
5. Click "Start Recording"
6. Grant microphone permission
7. Read the text aloud
8. Click "Stop Recording"
9. Hear playback
10. Optionally request AI feedback
11. Click "Submit"
12. See results or thank you message
```

### Admin Journey

```
1. Visit http://localhost:3000/admin/login
2. Login with admin / password123
3. Go to "Sessions" tab
4. Create or edit sessions
5. Upload reference audio
6. Go to "Analytics" tab
7. View participation metrics
```

---

## 📞 Need Help?

1. **Browser console errors?** → Press F12, check Console tab
2. **Server logs?** → Look at terminal where you ran npm
3. **Database issues?** → Verify MongoDB is running
4. **API problems?** → Check [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)

---

## 🎉 You're All Set!

Everything is ready. The application is:

✅ Installed
✅ Configured
✅ Running
✅ Tested and working

**Now explore and familiarize yourself with the system before March 20, 2026!**

---

**Questions?** See the documentation files or contact your development team.

**Ready to learn more?** → [README.md](README.md)
