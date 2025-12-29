# 🔧 Deployment Troubleshooting Guide

## Common Deployment Errors & Solutions

---

### ❌ Error 1: "Cannot connect to MongoDB"

**Symptoms:**
- Backend deployment fails
- Error: "MongoServerError: bad auth"
- Error: "connection timed out"

**Solutions:**

1. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Make sure `0.0.0.0/0` is whitelisted
   - Wait 2-3 minutes after adding

2. **Verify Connection String**
   - Format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname`
   - Replace `<password>` with actual password
   - Replace `<dbname>` with `invoice-financing`
   - URL encode special characters in password
     - Example: `p@ssw0rd!` becomes `p%40ssw0rd%21`

3. **Check Database User**
   - Go to Database Access
   - User must have "Read and write to any database" permission
   - Password must match exactly

**Test Connection:**
```bash
# Use MongoDB Compass or mongosh to test
mongosh "mongodb+srv://username:password@cluster.mongodb.net/invoice-financing"
```

---

### ❌ Error 2: CORS Policy Error

**Symptoms:**
- Frontend loads but API calls fail
- Browser console: "Access to XMLHttpRequest has been blocked by CORS policy"
- Error: "No 'Access-Control-Allow-Origin' header"

**Solutions:**

1. **Update Backend FRONTEND_URL**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Set `FRONTEND_URL` to exact Netlify URL
   - Example: `https://invoice-finance.netlify.app`
   - NO trailing slash!
   - Redeploy backend

2. **Check Frontend API URL**
   - Go to Netlify → Site settings → Environment variables
   - Verify `REACT_APP_API_URL` ends with `/api`
   - Example: `https://blc-backend.vercel.app/api`
   - Redeploy frontend

3. **Verify CORS Configuration**
   In `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

**Test:**
```bash
# Test CORS from browser console
fetch('https://your-backend.vercel.app/health')
  .then(r => r.json())
  .then(console.log)
```

---

### ❌ Error 3: "Module not found" during build

**Symptoms:**
- Build fails on Vercel/Netlify
- Error: "Cannot find module 'xyz'"
- Error: "Module not found: Can't resolve 'xyz'"

**Solutions:**

1. **Install Missing Dependencies**
   ```bash
   cd backend  # or frontend
   npm install
   npm install <missing-package>
   git add package.json package-lock.json
   git commit -m "Add missing dependencies"
   git push
   ```

2. **Check package.json**
   - All dependencies should be in `dependencies`, not `devDependencies`
   - Run `npm install --production` locally to test

3. **Clear Build Cache**
   - Vercel: Deployments → Click "..." → Redeploy
   - Netlify: Deploys → Trigger deploy → Clear cache and deploy

---

### ❌ Error 4: 404 Not Found on API Routes

**Symptoms:**
- Frontend loads but all API calls return 404
- Error: "Cannot GET /api/auth/login"

**Solutions:**

1. **Check API URL in Frontend**
   - Must include `/api` at the end
   - Correct: `https://backend.vercel.app/api`
   - Wrong: `https://backend.vercel.app`

2. **Verify Vercel Configuration**
   Check `backend/vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

3. **Test Backend Directly**
   ```bash
   curl https://your-backend.vercel.app/health
   curl https://your-backend.vercel.app/api/auth/login
   ```

---

### ❌ Error 5: JWT Token Issues

**Symptoms:**
- Can register but can't login
- Error: "jwt malformed"
- Error: "invalid token"

**Solutions:**

1. **Check JWT_SECRET**
   - Must be set in Vercel environment variables
   - Must be at least 32 characters
   - Generate strong secret:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

2. **Clear Browser Storage**
   - Open browser console (F12)
   - Application → Local Storage → Clear All
   - Try login again

3. **Verify Token Generation**
   In `backend/routes/auth.js`, check:
   ```javascript
   const token = jwt.sign(
     { id: user._id, role: user.role },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   ```

---

### ❌ Error 6: React Router 404 on Refresh

**Symptoms:**
- App works but refreshing page shows 404
- Direct URL navigation fails

**Solutions:**

1. **Add Netlify Redirects**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

2. **Or use netlify.toml**
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Redeploy Frontend**

---

### ❌ Error 7: Environment Variables Not Working

**Symptoms:**
- Variables are undefined
- `process.env.VARIABLE_NAME` returns undefined

**Solutions:**

1. **Frontend Variables Must Start with REACT_APP_**
   - Correct: `REACT_APP_API_URL`
   - Wrong: `API_URL`

2. **Rebuild After Adding Variables**
   - Adding env vars requires rebuild
   - Vercel/Netlify: Trigger new deployment

3. **Check Variable Names**
   - No typos
   - Case sensitive
   - No spaces around `=`

4. **Verify in Build Logs**
   - Check deployment logs
   - Variables should be listed (values hidden)

---

### ❌ Error 8: File Upload Fails

**Symptoms:**
- Invoice creation with files fails
- Error: "ENOENT: no such file or directory"

**Solutions:**

1. **Temporary Fix: Disable File Uploads**
   In `backend/server.js`:
   ```javascript
   // Comment out file upload
   app.post('/api/invoices/create', auth, async (req, res) => {
     // Skip file handling for now
     const documents = [];
     // ... rest of code
   });
   ```

2. **Long-term: Use Cloud Storage**
   - Cloudinary (recommended)
   - AWS S3
   - Vercel Blob Storage

**Note:** Vercel serverless functions don't support persistent file storage.

---

### ❌ Error 9: WebSocket Connection Failed

**Symptoms:**
- Error: "WebSocket connection failed"
- Real-time features not working

**Solutions:**

1. **Disable WebSocket for Vercel**
   In `backend/server.js`:
   ```javascript
   // Comment out WebSocket
   // const WebSocketService = require('./services/websocket');
   // const wsService = new WebSocketService(server);
   ```

2. **Use Alternative**
   - Pusher (free tier available)
   - Ably
   - Socket.io with separate server

**Note:** Vercel doesn't support WebSocket in serverless functions.

---

### ❌ Error 10: Build Timeout

**Symptoms:**
- Build takes too long and fails
- Error: "Build exceeded maximum time"

**Solutions:**

1. **Optimize Dependencies**
   ```bash
   npm prune
   npm dedupe
   ```

2. **Remove Unused Packages**
   ```bash
   npm uninstall <unused-package>
   ```

3. **Increase Build Time (Paid Plans)**
   - Vercel Pro: 45 minutes
   - Netlify Pro: 30 minutes

---

## 🔍 Debugging Checklist

When deployment fails, check in this order:

### Backend (Vercel)
- [ ] MongoDB Atlas connection string is correct
- [ ] All environment variables are set
- [ ] `vercel.json` exists and is correct
- [ ] `package.json` has all dependencies
- [ ] Build logs show no errors
- [ ] Health endpoint works: `/health`

### Frontend (Netlify)
- [ ] `REACT_APP_API_URL` is set correctly
- [ ] `_redirects` file exists in `public/`
- [ ] Build command is `npm run build`
- [ ] Publish directory is `build`
- [ ] Build logs show no errors
- [ ] Site loads without console errors

### Integration
- [ ] Backend FRONTEND_URL matches Netlify URL
- [ ] Frontend API_URL matches Vercel URL
- [ ] Both URLs have no trailing slashes
- [ ] CORS is configured correctly
- [ ] Can register a new user
- [ ] Can login successfully

---

## 🛠️ Useful Commands

### Test Backend Locally
```bash
cd backend
npm install
node server.js
# Visit http://localhost:5005/health
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm start
# Visit http://localhost:3000
```

### Check MongoDB Connection
```bash
mongosh "your-connection-string"
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test API with curl
```bash
# Health check
curl https://your-backend.vercel.app/health

# Register
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","role":"seller"}'

# Login
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## 📞 Still Stuck?

### Check Logs
1. **Vercel Logs**
   - Go to your project → Deployments
   - Click on latest deployment
   - Check "Build Logs" and "Function Logs"

2. **Netlify Logs**
   - Go to your site → Deploys
   - Click on latest deploy
   - Check "Deploy log"

3. **Browser Console**
   - Press F12
   - Check Console tab for errors
   - Check Network tab for failed requests

### Common Log Errors

**"Cannot find module"**
→ Missing dependency, run `npm install`

**"MongoServerError"**
→ MongoDB connection issue, check Atlas settings

**"CORS error"**
→ FRONTEND_URL mismatch, update and redeploy

**"jwt malformed"**
→ JWT_SECRET not set or token corrupted

---

## ✅ Verification Steps

After fixing issues:

1. **Backend Health Check**
   ```
   https://your-backend.vercel.app/health
   ```
   Should return: `{"success": true, "message": "BLC Server Running"}`

2. **Frontend Loads**
   ```
   https://your-app.netlify.app
   ```
   Should show homepage without errors

3. **Registration Works**
   - Create new account
   - Check browser console for errors
   - Should redirect to dashboard

4. **Login Works**
   - Login with created account
   - Should see dashboard
   - Token should be stored in localStorage

5. **API Calls Work**
   - Create invoice (if seller)
   - View marketplace (if investor)
   - No CORS errors in console

---

## 🎯 Success Criteria

Your deployment is fully working when:
- ✅ Backend health check returns success
- ✅ Frontend loads without console errors
- ✅ Can register new users
- ✅ Can login successfully
- ✅ Dashboard loads with data
- ✅ Can create invoices (sellers)
- ✅ Can view marketplace (investors)
- ✅ No CORS errors
- ✅ No 404 errors on page refresh
