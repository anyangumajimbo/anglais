# TESTING & VERIFICATION GUIDE - Semaine des Langues

## Pre-Launch Checklist

Before going live on March 20, 2026, verify all components:

### ✓ Checklist

- [ ] MongoDB is running and connected
- [ ] Backend server starts without errors
- [ ] Frontend builds without warnings
- [ ] Sample admin account exists (username: admin)
- [ ] Sample sessions created for testing dates
- [ ] Reference audio files upload successfully
- [ ] Microphone works in development
- [ ] OpenAI API key is valid
- [ ] Network connectivity between frontend and backend
- [ ] Date/time on server matches expected timezone

## Setup Verification Steps

### Step 1: Backend Verification

```bash
cd backend

# Install dependencies
npm install

# Check .env configuration
cat .env

# Run seed script
npm run seed
```

**Expected Output**:
```
MongoDB connected
Default admin created - username: admin, password: password123
Sample sessions created
Seed data completed successfully
```

### Step 2: Seed Database Verification

```bash
# Open MongoDB shell
mongo

# Connect to database
use semaines-de-langues

# Verify collections
show collections
# Output should include:
# admins
# analytics
# sessions

# Query sessions
db.sessions.find().pretty()
# Should show sample sessions with dates and scripts

# Verify admin
db.admins.findOne({ username: "admin" })
# Should show hashed password
```

### Step 3: Start Backend

```bash
npm run dev
```

**Expected Output**:
```
MongoDB connected
Server running on port 5000
```

**Verify API health**:
```bash
curl http://localhost:5000/api/health
# Response: { "status": "ok", "timestamp": "..." }
```

### Step 4: Start Frontend

```bash
cd frontend
npm install
npm start
```

**Expected Output**:
```
Compiled successfully!
On Your Network: http://192.168.x.x:3000
Local: http://localhost:3000
```

Browser should open automatically to http://localhost:3000

## Manual Testing Workflow

### Test 1: User Homepage

**Steps**:
1. Navigate to http://localhost:3000
2. Observe page loads
3. Check if today's session appears (if date is >= March 20, 2026)

**Verify**:
- [ ] Page displays "Semaine des Langues" header
- [ ] No console errors (F12 → Console)
- [ ] Session title visible (or appropriate message)
- [ ] Reference audio player appears (if audio uploaded)
- [ ] Script text displays clearly

**Expected Behavior**:
- **Before March 20**: "The sessions will begin soon."
- **March 20-22**: Sample test session appears
- **March 23-27**: Official event sessions appear
- **After March 27**: "The sessions have ended..." message

### Test 2: Microphone Recording

**Steps**:
1. From homepage, scroll to "Record Your Voice" section
2. Click "Start Recording"
3. Browser asks for microphone permission
4. Click "Allow"
5. Speak into microphone (read the script)
6. Click "Stop Recording"
7. Click "Play Recording" to verify audio captured

**Verify**:
- [ ] Microphone permission prompt appears
- [ ] Recording button changes to "Stop Recording"
- [ ] Play button becomes available after recording
- [ ] Audio plays back clearly in browser

**Troubleshooting**:
```
"Microphone access is required" error
→ Check browser permissions
→ Try clear browser cache and reload
→ Ensure microphone is not muted in browser settings
```

### Test 3: Submit Without AI Feedback

**Steps**:
1. Complete recording (Test 2)
2. Keep "I want AI feedback" unchecked
3. Click "Submit Recording"
4. Wait for response

**Verify**:
- [ ] "Thank you for taking part..." message appears
- [ ] Recording cleared
- [ ] No attempt to contact AI API

**Expected Message**:
```
"Thank you for taking part in today's session. 
Please check tomorrow for tomorrow's session."
```

### Test 4: Submit With AI Feedback (Requires OpenAI API)

**Prerequisites**:
- Valid OPENAI_API_KEY in .env
- Account has API credits

**Steps**:
1. Complete recording (Test 2)
2. Check "I want AI feedback"
3. Notice consent checkbox appears
4. Check "I consent to provide my audio..."
5. Click "Submit Recording"
6. Wait 10-30 seconds for AI processing

**Verify**:
- [ ] "Processing..." shows during submission
- [ ] Feedback appears with scores
- [ ] 4 scores displayed (Overall, Pronunciation, Fluency, Accuracy)
- [ ] 3 encouraging comments shown

**Troubleshooting**:
```
"AI feedback is currently unavailable" error
→ Check OPENAI_API_KEY is set and valid
→ Verify API key has usage quota remaining
→ Check internet connectivity
→ Look at backend logs for API error details
```

### Test 5: Admin Login

**Steps**:
1. Click "Admin Access" at bottom of homepage
2. Navigate to http://localhost:3000/admin/login
3. Enter username: `admin`
4. Enter password: `password123`
5. Click "Login"

**Verify**:
- [ ] No console errors
- [ ] Redirects to /admin/dashboard
- [ ] Dashboard loads successfully

**Troubleshooting**:
```
"Invalid credentials" error
→ Verify seed script was run
→ Check MongoDB for admin user: db.admins.findOne()
→ Confirm spelling of username/password
```

### Test 6: Session Management (Admin)

**Steps**:
1. Login to admin dashboard (Test 5)
2. Verify "Sessions" tab is active
3. Click "+ New Session"
4. Fill in form:
   - Title: "Test Session"
   - Date: "2026-03-24"
   - Script: "Hello, this is a test session."
   - Active: checked
5. Click "Create Session"

**Verify**:
- [ ] Form closes
- [ ] New session appears in table
- [ ] Date shown correctly
- [ ] Status shows "Active"

**Expected Table Columns**:
- Date
- Title
- Script (preview)
- Audio (✕ - not uploaded yet)
- Status
- Actions (Edit, Audio buttons)

### Test 7: Audio Upload (Admin)

**Prerequisites**:
- Created a session (Test 6)
- Have an audio file (MP3, WAV, or OGG)

**Steps**:
1. In session table, find test session
2. Click "Audio" button
3. Select audio file from computer
4. Wait for upload to complete

**Verify**:
- [ ] "Uploading..." message appears
- [ ] Upload completes
- [ ] Audio column shows "✓" (checkmark)
- [ ] No error messages

**Test Audio File**:
```bash
# Create a simple WAV file for testing
ffmpeg -f lavfi -i sine=frequency=1000:duration=3 test-audio.wav
```

### Test 8: Analytics Dashboard (Admin)

**Steps**:
1. Login to admin dashboard
2. Click "Analytics" tab
3. Observe metrics

**Verify**:
- [ ] Page loads without errors
- [ ] Shows stat cards:
  - Total Visitors
  - Practice Attempts
  - Recordings Submitted
  - AI Feedback Requests
  - AI Feedback Completed
- [ ] Current week stats section visible
- [ ] Daily participation table (if events happened)
- [ ] "Refresh Analytics" button works

**Test Event Tracking**:
1. Visit homepage (tracks click)
2. Start recording (tracks attempt)
3. Submit without feedback (tracks recording_submit)
4. Return to analytics, click refresh
5. Verify click and attempt counts increased

### Test 9: Mobile Responsiveness

**Steps**:
1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Click mobile icon (or Ctrl+Shift+M)
4. Test different screen sizes:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Android (375x812)

**Verify**:
- [ ] Layout responsive (no horizontal scroll)
- [ ] Buttons are large and tappable
- [ ] Text is readable
- [ ] Audio player visible
- [ ] Form inputs work on mobile

### Test 10: Browser Compatibility

**Test in**:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Check**:
- [ ] No console errors
- [ ] Audio recording works
- [ ] Microphone permission requested correctly
- [ ] Responsive design works

**Known Limitations**:
- Microphone requires HTTPS in production (HTTP works in localhost)
- Safari may have different microphone permission flow

## Load Testing (Before March 20)

### Simulate Traffic

```bash
# Install artillery
npm install -g artillery

# Create test file: load-test.yml
global:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10  # 10 requests/second
      name: "Ramp up"

scenarios:
  - name: "Session Access"
    flow:
      - get:
          url: "/api/session/today"

# Run test
artillery run load-test.yml
```

**Verify**:
- [ ] Backend handles load without crashing
- [ ] Database queries remain fast
- [ ] No memory leaks
- [ ] Error rate < 1%

## Date Testing

### Test Different Scenarios

```bash
# Change system date (for testing - do NOT do this in production)
# Or update date references in sessionController.js temporarily:

// Before March 20
// System Date: 2026-03-19
// Expected: "The sessions will begin soon."

// During Event
// System Date: 2026-03-23
// Session with date: 2026-03-23
// Expected: Session displays

// After Event
// System Date: 2026-03-28
// Expected: "The sessions have ended..."

// Out of Range
// System Date: 2026-04-01
// Expected: "The sessions have ended..."
```

## AI API Testing

### Test Whisper Transcription

```bash
# Create test audio file
ffmpeg -f lavfi -i sine=frequency=1000:duration=2 test.wav

# Test transcription endpoint directly
curl -X POST https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "file=@test.wav" \
  -F "model=whisper-1"
```

### Test GPT Feedback

```bash
# Test chat completion endpoint
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Error Handling Verification

### Test Error Cases

**Test 1: Missing Microphone Permission**
- [ ] Error message: "Microphone access is required"
- [ ] Recording button disabled
- [ ] User can retry

**Test 2: Empty Recording**
- Click submit without recording
- [ ] Error: "Please record your voice before submitting"

**Test 3: No Consent for Feedback**
- Check "I want AI feedback"
- Don't check consent
- Click submit
- [ ] Error: "You must give consent..."

**Test 4: AI API Failure**
- Temporarily disable OpenAI API in .env
- Try to submit with feedback
- [ ] Error: "AI feedback is currently unavailable"

**Test 5: No Session Available**
- Set system date to before March 20, 2026
- Visit homepage
- [ ] Message: "The sessions will begin soon"

## Performance Testing

### Check Load Times

```bash
# Frontend build
cd frontend
npm run build

# Check bundle size
npm install -g bundle-stats
bundle-stats ./build
```

**Target Metrics**:
- [ ] Bundle size < 500KB (gzipped)
- [ ] First contentful paint < 2s
- [ ] Time to interactive < 3s

### Backend Performance

```bash
# Measure API response times
time curl http://localhost:5000/api/session/today

# Expected: < 100ms for session query
# Expected: < 3s for AI feedback processing
```

## Deployment Verification

### Before Going Live

1. **Backend Deployment**
   - [ ] Server runs without errors
   - [ ] All environment variables set
   - [ ] Database connected
   - [ ] HTTPS configured (production)

2. **Frontend Deployment**
   - [ ] Build succeeds
   - [ ] API URL points to production API
   - [ ] Assets load correctly
   - [ ] HTTPS enabled
   - [ ] Microphone works (HTTPS required)

3. **Database**
   - [ ] Backup strategy in place
   - [ ] Indexes created
   - [ ] Admin account exists
   - [ ] Sessions created for event dates

4. **Monitoring**
   - [ ] Error tracking enabled (Sentry)
   - [ ] Uptime monitoring active (Uptime Robot)
   - [ ] Logs accessible
   - [ ] Alerting configured

## Rollback Procedure

If issues occur post-launch:

1. **Hotfix in Progress**
   ```bash
   # Keep previous version running
   # Fix code
   # Deploy new version
   # Verify before switching traffic
   ```

2. **Immediate Rollback**
   ```bash
   # Revert to previous commit
   git revert HEAD
   npm run build
   # Re-deploy
   ```

3. **Database Rollback**
   ```bash
   # Restore from backup
   mongorestore /backup
   ```

## Sign-Off

When all tests pass, complete sign-off:

```
Date: ____________
Tester: ____________
Backend: PASS / FAIL
Frontend: PASS / FAIL
Admin: PASS / FAIL
Analytics: PASS / FAIL
Mobile: PASS / FAIL
Performance: PASS / FAIL
Launch Approved: YES / NO
```

---

**Questions during testing?** Contact the development team immediately.
