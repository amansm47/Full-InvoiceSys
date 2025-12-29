# Deployment Guide - Invoice Financing Platform

## 🚀 Quick Deployment Steps

### Prerequisites
1. MongoDB Atlas account (free tier works)
2. Vercel account (for backend)
3. Netlify account (for frontend)
4. GitHub repository

---

## 📦 Part 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Generate secure password (save it!)
   - User Privileges: "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `invoice-financing`
   - Example: `mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/invoice-financing?retryWrites=true&w=majority`

---

## 🔧 Part 2: Backend Deployment (Vercel)

### Step 1: Update .gitignore
Make sure your `.gitignore` includes:
```
node_modules/
.env
.env.local
uploads/
```

### Step 2: Push to GitHub
```bash
cd backend
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory

3. **Configure Environment Variables**
   Click "Environment Variables" and add:

   ```
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/invoice-financing?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SESSION_SECRET=your-super-secret-session-key-change-this
   PORT=5005
   NODE_ENV=production
   FRONTEND_URL=https://your-app.netlify.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

## 🎨 Part 3: Frontend Deployment (Netlify)

### Step 1: Update Environment Variables

Create/update `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### Step 2: Deploy to Netlify

1. **Go to Netlify**
   - Visit https://www.netlify.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Set base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Configure Environment Variables**
   Go to "Site settings" → "Environment variables" and add:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment
   - Copy your frontend URL (e.g., `https://your-app.netlify.app`)

### Step 3: Update Backend CORS

Go back to Vercel → Your Backend Project → Settings → Environment Variables

Update `FRONTEND_URL`:
```
FRONTEND_URL=https://your-app.netlify.app
```

Redeploy backend for changes to take effect.

---

## ⚠️ Important Fixes Needed

### 1. File Upload Issue
Your current code uses local file storage which won't work on Vercel (serverless).

**Solution Options:**
- Use AWS S3
- Use Cloudinary
- Use Vercel Blob Storage

### 2. WebSocket Issue
WebSocket won't work on Vercel's serverless functions.

**Solution Options:**
- Use Vercel's Edge Functions
- Use a separate WebSocket service (Pusher, Ably)
- Remove real-time features for now

### 3. Session Storage
Express sessions won't persist on serverless.

**Solution:**
- Use JWT tokens only (already implemented)
- Remove session middleware

---

## 🔍 Testing Deployment

### Test Backend
```bash
curl https://your-backend.vercel.app/health
```

Should return:
```json
{
  "success": true,
  "message": "BLC Enhanced Server Running"
}
```

### Test Frontend
1. Open `https://your-app.netlify.app`
2. Try to register a new user
3. Try to login
4. Check browser console for errors

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
- Make sure `FRONTEND_URL` in Vercel matches your Netlify URL exactly
- Redeploy backend after changing environment variables

### Issue 2: API Not Found (404)
**Error:** "Cannot GET /api/auth/login"

**Solution:**
- Check `REACT_APP_API_URL` in Netlify includes `/api`
- Should be: `https://your-backend.vercel.app/api`

### Issue 3: MongoDB Connection Failed
**Error:** "MongoServerError: bad auth"

**Solution:**
- Check MongoDB Atlas username and password
- Make sure IP whitelist includes 0.0.0.0/0
- URL encode special characters in password

### Issue 4: Build Failed
**Error:** "Module not found"

**Solution:**
- Run `npm install` locally first
- Make sure `package.json` has all dependencies
- Check Node version (use 16+)

---

## 📝 Quick Fixes for Your Code

### Fix 1: Remove WebSocket (Temporary)
In `backend/server.js`, comment out WebSocket code:
```javascript
// const WebSocketService = require('./services/websocket');
// const wsService = new WebSocketService(server);
```

### Fix 2: Simplify File Upload
For now, disable file uploads or use a placeholder:
```javascript
// In invoice creation, skip file handling
const documents = [];
```

### Fix 3: Remove Session Middleware
```javascript
// Comment out session middleware
// app.use(session({...}));
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Backend pushed to GitHub
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Frontend environment variables updated
- [ ] Frontend deployed to Netlify
- [ ] Frontend URL copied
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed
- [ ] Tested registration
- [ ] Tested login
- [ ] Tested invoice creation

---

## 🆘 Need Help?

If deployment fails:
1. Check Vercel/Netlify deployment logs
2. Check browser console for errors
3. Test backend API directly with curl/Postman
4. Verify all environment variables are set correctly
5. Make sure MongoDB Atlas is accessible

---

## 🚀 Alternative: Deploy Both on Render.com

If Vercel/Netlify is too complex, use Render.com for both:

1. **Create Render Account**
2. **Deploy Backend as Web Service**
   - Connect GitHub
   - Build command: `npm install`
   - Start command: `node server.js`
   - Add environment variables

3. **Deploy Frontend as Static Site**
   - Connect GitHub
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variables

Render.com supports:
- File uploads (persistent disk)
- WebSockets
- Long-running processes
- Free tier available

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Render Documentation](https://render.com/docs)
