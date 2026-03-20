# ADMIN GUIDE - Semaine des Langues

## Accessing the Admin Dashboard

1. Open http://localhost:3000/admin/login
2. Log in with credentials:
   - **Username**: admin
   - **Password**: password123 (⚠️ Change immediately!)

## Admin Features

### 1. Session Management

#### Creating a New Session

1. Click **"New Session"** button
2. Fill in the form:
   - **Session Title**: Give it a descriptive name (e.g., "Monday Morning Practice")
   - **Date**: Select the date when this session will be available to students
   - **Script Text**: Paste the text students will read aloud
   - **Active**: Toggle to activate/deactivate session

3. Click **"Create Session"**
4. The session appears in the table below

#### Editing an Existing Session

1. Find the session in the table
2. Click the **"Edit"** button
3. Modify the fields as needed
4. Click **"Update Session"**

#### Uploading Reference Audio

1. Click the **"Audio"** button next to the session
2. Select an MP3, WAV, or OGG audio file
3. The audio is uploaded and linked to the session
4. Students will hear this audio when they open the session

**Audio Best Practices**:
- Clear, natural pronunciation
- Moderate speaking pace
- Format: MP3, WAV, or OGG
- Duration: 30 seconds - 3 minutes recommended
- Use a high-quality microphone

#### Session Status

- ✓ **Active**: Session is visible to students
- ✕ **Inactive**: Session is hidden from students (useful for drafts)

### 2. Managing Sessions by Date

Sessions are assigned to specific dates. The system will:
- Display the session if the current date matches the assigned date
- Update daily automatically based on your server's system date

**Date Range for Events**:
- Testing: March 20-22, 2026
- Official Event: March 23-27, 2026
- Out of range (before/after): Messages appear

### 3. Analytics Dashboard

Click the **"Analytics"** tab to view participation metrics:

#### Key Metrics Displayed

- **Total Visitors**: Number of times the homepage was accessed
- **Practice Attempts**: Number of students who started recording
- **Recordings Submitted**: Actual recordings sent for evaluation
- **AI Feedback Requests**: Students who chose AI feedback
- **AI Feedback Completed**: Success rate of AI evaluations

#### Current Week Activity

Shows activity from the last 30 days:
- Clicks
- Attempts
- Recordings
- AI Requests

#### Daily Participation Table

Detailed breakdown by date:
- When students accessed the site
- Participation trends
- Recording submission rates

**Privacy Note**: No student identities are recorded—just anonymous counts.

### 4. Session Table Overview

The table shows all sessions with:

| Column | Description |
|--------|-------------|
| Date | Assigned date (YYYY-MM-DD) |
| Title | Session name |
| Script | Preview of the text (first 30 characters) |
| Audio | ✓ if audio uploaded, ✕ if missing |
| Status | Active or Inactive |
| Actions | Edit and Upload buttons |

## Workflow Examples

### Scenario 1: Setup for Testing Phase (March 20-22)

1. **March 19**: Create sessions for testing
   - Create "Test Session 1" for March 20
   - Create "Test Session 2" for March 21
   - Create "Test Session 3" for March 22
   - Upload reference audio for each

2. **March 20**: Monitor first day
   - Check Analytics dashboard
   - Verify students can record and see feedback
   - Fix any issues found

### Scenario 2: Setup for Official Event (March 23-27)

1. **March 22**: Prepare all sessions
   - Create 5 sessions (one per day) with unique content
   - Title them descriptively: "Day 1 - Animals", "Day 2 - Hobbies", etc.
   - Upload high-quality reference audio
   - Activate all sessions

2. **March 23-27**: Monitor daily
   - Check Analytics each morning
   - View participation trends
   - Note any technical issues

### Scenario 3: Mid-Event Script Change

If you need to change a session text:

1. Click **"Edit"** on the session
2. Update the Script Text
3. Click **"Update Session"**
4. Changes take effect immediately for new submissions

**Note**: Changing script doesn't affect students who already started recording.

## Password Management

### Change Admin Password

Currently, you must change the password via:

1. **MongoDB direct update** (technical):
```bash
mongo semaines-de-langues
db.admins.updateOne(
  { username: "admin" },
  { $set: { password: await bcrypt.hash("newpassword", 10) } }
)
```

2. Or contact the development team for a feature to change password via UI

## Tips & Best Practices

### Creating Good Sessions

✓ **DO**:
- Use clear, friendly text
- Keep text length 200-400 words
- Provide accurate reference audio
- Create descriptive titles
- Test your sessions before the event

✗ **DON'T**:
- Use overly complex or fast text
- Upload poor-quality audio
- Leave sessions in "Draft" indefinitely
- Add multiple sessions for same date

### Content Ideas

- Daily prompts (e.g., "Describe your favorite hobby")
- Story readings
- Dialogue practice
- Vocabulary exercises
- Culture/history passages

### Monitoring Participation

Check the Analytics dashboard daily:
- High clicks + low recordings = users struggling to use microphone
- High attempts + low submissions = consenting issue
- Track trends over the 8-day event

### Troubleshooting Common Issues

**No students showing up?**
- Verify session is Active
- Check date matches today's date
- Ensure at least one session exists for today

**Audio not playing?**
- Check file format (MP3, WAV, OGG)
- Verify file upload succeeded (progress indicator)
- Try re-uploading with smaller file size

**AI feedback failing?**
- Check OpenAI API status
- Verify API key is valid
- Check account hasn't hit rate limits

**Students can't record?**
- Browser must ask for microphone permission
- User must click **"Allow"**
- HTTP requires explicit permission, HTTPS is seamless

## Analytics Interpretation

| Metric | What It Means |
|--------|--------------|
| Visitors > Attempts | Users opened but didn't try recording |
| Attempts > Recordings | Users started but didn't submit |
| Recordings > AI Requests | Not all users want feedback |
| AI Requests ≠ AI Completed | Some AI evaluations failed |

## Event Summary After March 27

After the event ends:
1. All students see: "Sessions have ended. Thank you for participating."
2. Export analytics for review
3. Archive completed sessions if needed
4. Create new sessions for future events

## Support

**Issue on dashboard?**
- Check browser console (F12) for errors
- Verify internet connection
- Try logging out and back in
- Clear browser cache

**Lost admin password?**
- Contact the development team
- Admin credentials are in MongoDB, can be reset directly

---

**Questions?** Contact the IT/Development Team
