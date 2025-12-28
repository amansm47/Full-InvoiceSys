# Railway deployment configuration

# Backend service configuration
backend/
  - Root Directory: backend
  - Build Command: npm install
  - Start Command: npm start
  - Port: 5000

# Frontend service configuration  
frontend/
  - Root Directory: frontend
  - Build Command: npm run build
  - Start Command: npx serve -s build -l 3000
  - Port: 3000

# Environment Variables Needed:
# Backend:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5000

# Frontend:
REACT_APP_API_URL=https://your-backend-url.railway.app/api