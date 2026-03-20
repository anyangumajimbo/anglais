# DEPLOYMENT GUIDE - Semaine des Langues

## Overview

This guide covers deploying the Semaine des Langues application to production using various cloud platforms.

## Pre-Deployment Checklist

- [ ] Change default admin credentials
- [ ] Set `NODE_ENV=production` in backend
- [ ] Use a strong `JWT_SECRET`
- [ ] Configure CORS for frontend domain
- [ ] Set up MongoDB backup strategy
- [ ] Configure OpenAI API rate limits
- [ ] Set up SSL/TLS certificates
- [ ] Test microphone in HTTPS (required for production)

## Option 1: Docker Deployment

### Build and Run Locally

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Push to Docker Registry

```bash
docker build --build-arg NODE_ENV=production -t your-registry/semaines-de-langues-backend ./backend
docker push your-registry/semaines-de-langues-backend

docker build -t your-registry/semaines-de-langues-frontend ./frontend
docker push your-registry/semaines-de-langues-frontend
```

## Option 2: Heroku Deployment

### Backend on Heroku

```bash
cd backend

# Create Heroku app
heroku create your-app-name-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_url
heroku config:set OPENAI_API_KEY=your_openai_key
heroku config:set JWT_SECRET=your_secure_secret
heroku config:set NODE_ENV=production

# Add Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Frontend on Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
vercel env add REACT_APP_API_URL https://your-app-name-backend.herokuapp.com/api
```

## Option 3: AWS Deployment

### Backend on AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS or similar
   - Security group: open ports 22, 5000

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm mongodb-org
sudo npm install -g pnpm
```

3. **Clone Repository & Deploy**
```bash
git clone <repo> && cd semaines-de-langues/backend
pnpm install
pnpm start
```

4. **Use PM2 for Process Management**
```bash
sudo npm install -g pm2
pm2 start server.js --name "semaines-backend"
pm2 startup
pm2 save
```

### Frontend on AWS S3 + CloudFront

```bash
cd frontend
pnpm build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Create CloudFront distribution pointing to S3 bucket
```

## Option 4: Vercel (Full-Stack)

### Monorepo Structure on Vercel

1. **Create vercel.json**
```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "frontend/build",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend-url/api/$1" }
  ]
}
```

2. **Link Vercel Project**
```bash
vercel
```

3. **Set Environment Variables** in Vercel Dashboard

## Option 5: DigitalOcean App Platform

### Deploy via GitHub

1. Connect GitHub repository to DigitalOcean App Platform
2. Create app with services:
   - Backend: Node.js
   - MongoDB: DigitalOcean Managed Database
   - Frontend: Static Site

3. Set environment variables for each service
4. Deploy

## Database Deployment

### MongoDB Atlas (Cloud)

1. **Create Atlas Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**
3. **Set Environment Variable**:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/semaines-de-langues?retryWrites=true&w=majority
```

### Self-Hosted MongoDB on Server

```bash
# Install MongoDB
sudo apt install mongodb-server

# Backup
mongodump --out /backup

# Restore
mongorestore /backup
```

## SSL/TLS Configuration

### For Frontend (HTTPS)

- **Vercel**: Automatic
- **Netlify**: Automatic
- **Custom Domain**: Use Let's Encrypt with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

### API Endpoint Update

After configuring HTTPS, update frontend API URL:

```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Microphone Access (HTTPS Requirement)

**Important**: Microphone access requires HTTPS in production. Update frontend:

```javascript
// In src/components/AudioRecorder.js
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
```

This only works over HTTPS (except localhost).

## Environment Variables Reference

### Backend Production
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/semaines-de-langues
PORT=5000
JWT_SECRET=long_random_secure_string_min_32_chars
OPENAI_API_KEY=sk-...
NODE_ENV=production
OPENAI_ORG_ID=org-... (optional)
```

### Frontend Production
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Performance Optimization

### Backend
- Enable gzip compression
- Use CDN for audio files
- Cache sessions
- Rate limit API endpoints

```javascript
// Example: Add compression to server.js
const compression = require('compression');
app.use(compression());
```

### Frontend
- Minify CSS/JS (automatic with `pnpm build`)
- Optimize images
- Lazy load components
- Use service workers

## Monitoring & Logging

### Backend Logging
```bash
npm install winston
```

### Uptime Monitoring
- Use services like Uptime Robot
- Set up alerts for API failures

### Error Tracking
- Integrate Sentry
- Monitor OpenAI API usage

## Scaling Considerations

- **Database**: Increase MongoDB Atlas cluster size
- **Backend**: Use load balancer (AWS ELB, Heroku dynos)
- **Frontend**: CDN distribution (CloudFront, Cloudflare)
- **API Rate Limiting**: Implement throttling for OpenAI calls

## Backup & Disaster Recovery

### Database Backup
```bash
# Manual backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net" --out ./backup

# Automated: Enable Atlas Backup
```

### Configuration Backup
- Keep `.env.production` in secure vault (not in git)
- Document environment variable setup
- Version control infrastructure code

## Testing in Production

1. **Smoke Test**
```bash
curl https://api.yourdomain.com/api/health
```

2. **User Journey Test**
   - Open frontend
   - Load today's session
   - Test microphone
   - Submit recording
   - Check AI feedback

3. **Load Testing**
```bash
sudo npm install -g artillery
artillery quick --count 100 --num 10 https://yourdomain.com
```

## Rollback Plan

1. Keep previous version deployed
2. Update DNS to point to previous version
3. Or use blue-green deployment with load balancer

## Support & Troubleshooting

**Microphone not working in production?**
- Ensure HTTPS is enabled
- Check browser permissions

**OpenAI API rate limits?**
- Implement queue system
- Cache responses

**Database performance issues?**
- Add indexes
- Monitor slow queries
- Scale cluster

---

**Last Updated**: March 2026
