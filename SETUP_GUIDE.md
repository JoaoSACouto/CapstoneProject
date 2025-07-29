# RestJAM Development Environment Setup Guide

This guide provides step-by-step instructions for setting up the RestJAM local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **MongoDB** - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

### Required Accounts & API Keys
- **Firebase Project** with Authentication enabled - [Firebase Console](https://console.firebase.google.com/)
- **Cloudinary Account** for image storage - [Cloudinary](https://cloudinary.com/)
- **Google Gemini AI API Key** for AI-enhanced search (optional) - [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Stripe Account** for payment processing (optional) - [Stripe](https://stripe.com/)
- **Google Maps API Key** for location features (optional) - [Google Cloud Console](https://console.cloud.google.com/)

### System Requirements
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/JoaoSACouto/CapstoneProject.git
cd CapstoneProject
```

### 2. Install Dependencies

#### Install Server Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

## ⚙️ Environment Configuration

### 3. Set up Server Environment Variables

Create a `.env` file in the `/server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Server Configuration
PORT=3500
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/restjam

# Firebase Admin SDK (for authentication)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...

# Google Gemini AI (for enhanced search)
GEMINI_API_KEY=your_gemini_api_key_here

# Client Configuration (for CORS and Stripe redirects)
CLIENT_URL=https://your-deployed-client-domain.com
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Set up Client Environment Variables

Create a `.env` file in the `/client` directory:

```bash
cd ../client
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Application mode (development, production)
VITE_APP_MODE=development

# Whether backend is available (true/false)
VITE_HAS_BACKEND=true

# App Configuration
VITE_APP_NAME=RestJAM
VITE_APP_VERSION=1.0.0

# API Configuration
VITE_API_URL=http://localhost:3500

# Google Maps API key for location features
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# AI Search Configuration
VITE_ENABLE_AI_SEARCH=true

# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🗄️ Database Setup

### 5. Start MongoDB

#### Option A: Local MongoDB Installation
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows (if installed as service):
net start MongoDB

# On Linux:
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your server `.env` file

### 6. Verify Database Connection
The application will automatically create the database and collections when you first run the server.

## 🔥 Firebase Setup

### 7. Configure Firebase Authentication

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password and Google sign-in
4. Get your Firebase config:
   - Go to Project Settings → General
   - In "Your apps" section, add a web app
   - Copy the config values to your client `.env` file
5. Generate Firebase Admin SDK key:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the entire JSON content to `FIREBASE_SERVICE_ACCOUNT_KEY` in server `.env`

## ☁️ Cloudinary Setup

### 8. Configure Image Storage

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add these values to your server `.env` file

## 🤖 Google Gemini AI Setup (Optional)

### 9. Configure AI-Enhanced Search

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" 
4. Copy the generated API key
5. Add `GEMINI_API_KEY=your_api_key_here` to your server `.env` file
6. Set `VITE_ENABLE_AI_SEARCH=true` in your client `.env` file

**Note**: AI search is optional. If not configured, the application will work normally with regular search functionality only.

## 🚀 Running the Application

### 10. Start Development Servers

#### Start the Backend Server
```bash
cd server
npm start
```
The server will run on http://localhost:3500

#### Start the Frontend Development Server
```bash
cd client
npm run dev
```
The client will run on http://localhost:5173

### 11. Verify Installation

1. Open your browser to http://localhost:5173
2. You should see the RestJAM homepage
3. Try creating an account to test Firebase authentication
4. Check the console for any error messages

## 📦 Available Scripts

### Client Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint
```

### Server Scripts
```bash
# Start production server
npm start

# Start development server with nodemon
npm run dev
```

### 12. Seed database (rating table)
```bash
cd /server/scripts/
node seedRatings.js

## 🧪 Testing

### Unit Tests (Client)
```bash
cd client
npm run test
```

### End-to-End Tests (Client)
```bash
cd client
npm run test:e2e
```

## 🛠️ Troubleshooting

### Common Issues

#### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify `MONGODB_URI` in server `.env`

#### Firebase Authentication Issues
- Verify all Firebase environment variables are set correctly
- Check Firebase console for authentication method configuration
- Ensure Firebase project has the correct domain configured

#### AI Search Issues
- AI search not appearing: Check `VITE_ENABLE_AI_SEARCH=true` in client `.env`
- AI search errors: Verify `GEMINI_API_KEY` is set correctly in server `.env`
- No AI suggestions: AI search only activates when regular search returns no results

#### Port Already in Use
```bash
# Kill process on port 3500 (server)
npx kill-port 3500

# Kill process on port 5173 (client)
npx kill-port 5173
```

#### Node Modules Issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
- Ensure `.env` files are in the correct directories
- Restart development servers after changing environment variables
- Check that variable names match exactly (case-sensitive)

## 📚 Project Structure

```
CapstoneProject/
├── client/                 # Frontend React application
│   ├── src/
│   ├── public/
│   ├── .env               # Client environment variables
│   └── package.json
├── server/                # Backend Node.js/Express application
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── .env               # Server environment variables
│   └── package.json
└── SETUP_GUIDE.md         # This file
```

## 🔄 Development Workflow

1. **Make Changes**: Edit code in either `client/` or `server/` directories
2. **Hot Reload**: Both servers support hot reloading during development
3. **Test**: Run tests frequently to catch issues early
4. **Git Workflow**: 
   ```bash
   git add .
   git commit -m "your message"
   git push origin your-branch
   ```

## 🚀 Production Build

### Build Client for Production
```bash
cd client
npm run build
```

### Test Production Build Locally
```bash
cd client
npm run preview
```

## 📞 Support

If you encounter issues during setup:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all required services are running (MongoDB, etc.)
4. Review the troubleshooting section above

## 🎯 Next Steps

After successful setup:
1. Familiarize yourself with the codebase structure
2. Review the existing GraphQL schema in `server/graphql/`
3. Explore the React components in `client/src/components/`
4. Run the test suite to understand the application flow
5. Set up your IDE with recommended extensions for React and Node.js development

---

**Happy Coding! 🎉**