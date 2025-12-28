# Invoice Financing Platform - Frontend

React.js frontend application for the Invoice Financing Platform.

## 🚀 Features

- **Modern UI**: Material-UI components with responsive design
- **Authentication**: JWT-based login/register with KYC
- **Dashboard**: Role-based dashboards (Seller/Buyer/Investor)
- **Invoice Management**: Create, upload, and track invoices
- **Marketplace**: Browse and invest in invoices
- **Real-time Updates**: Live notifications and updates
- **File Upload**: Invoice document upload with preview
- **Portfolio**: Investment tracking and analytics

## 🛠️ Tech Stack

- React.js 18
- Material-UI (MUI)
- React Router DOM
- Axios (API calls)
- Context API (State management)
- Socket.io Client (Real-time)
- React Hook Form
- Chart.js (Analytics)

## 📁 Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── context/      # React contexts
│   ├── hooks/        # Custom hooks
│   ├── config/       # Configuration
│   └── lib/          # Utilities
└── package.json
```

## 🔧 Installation

```bash
# Clone repository
git clone <frontend-repo-url>
cd invoice-financing-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm start
```

## 🌐 Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Firebase (if using)
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# App Configuration
REACT_APP_APP_NAME=Invoice Financing Platform
REACT_APP_VERSION=1.0.0
```

## 🎯 User Roles & Features

### Seller (MSME)
- Register and complete KYC verification
- Create and upload invoices
- Track invoice status and funding
- Receive immediate payments
- View transaction history

### Buyer (Corporate)
- Register and verify company details
- Receive invoice confirmation requests
- Confirm legitimate invoices
- Track payment obligations
- Manage supplier relationships

### Investor
- Browse marketplace of verified invoices
- Filter by risk, return, and duration
- Fund invoices at discounted rates
- Track investment portfolio
- Receive returns on maturity

## 📱 Pages & Components

### Authentication
- `Login.js` - User login with role selection
- `Register.js` - Multi-step registration with KYC
- `AuthContext.js` - Authentication state management

### Dashboards
- `SellerDashboard.js` - Invoice creation and tracking
- `InvestorDashboard.js` - Investment opportunities
- `Dashboard.js` - Buyer invoice confirmations

### Core Features
- `CreateInvoice.js` - Invoice creation form
- `Marketplace.js` - Investment marketplace
- `Portfolio.js` - Investment tracking

### Components
- `Navbar.js` - Navigation header
- `Footer.js` - Application footer
- `Sidebar.js` - Navigation sidebar

## 🔄 API Integration

The frontend communicates with the backend API:

```javascript
// API Service Example
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🎨 Styling & Theme

- Material-UI theme customization
- Responsive design for mobile/tablet/desktop
- Dark/light mode support
- Custom color palette for branding

## 🔐 Authentication Flow

1. User selects role and registers
2. Complete KYC verification
3. Login with credentials
4. JWT token stored in localStorage
5. Protected routes check authentication
6. Auto-refresh on token expiry

## 📊 State Management

Using React Context API for:
- Authentication state
- User profile data
- Real-time notifications
- Theme preferences

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Login.test.js
```

## 📦 Build & Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Netlify
```bash
# Build and deploy
npm run build
# Upload build/ folder to Netlify
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔗 Backend Integration

This frontend connects to the Invoice Financing Backend:
- Repository: `<backend-repo-url>`
- API endpoints for all operations
- WebSocket for real-time updates
- File upload for invoice documents

## 🚀 Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies
- Progressive Web App features

## 📱 Mobile Responsiveness

- Fully responsive design
- Touch-friendly interface
- Mobile-first approach
- Progressive Web App capabilities

## 📄 License

MIT License