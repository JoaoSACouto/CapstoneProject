# RestJAM - Restaurant Social Media Application

A full-stack social media platform for sharing restaurant experiences and recommendations, built by students at Conestoga College as a capstone project.

## 🚀 Live Application

**✅ Sprint 4 - Currently Deployed**
https://capstone-project-amber-one.vercel.app/

## 📋 Project Status

**Current Phase**: Sprint 4 Complete ✅  
**Status**: Production Ready & Deployed  
**Last Updated**: August 2025

## 🔗 Project Links

- **Design Board**: https://www.figma.com/board/dfU3ZlTdQUzOBkqz3kDND7/Capstone-FIgJam?node-id=0-1&t=5dUhe3uWqOWyfBnV-1

## ✨ Completed Features

### 🔐 User Management & Authentication

- ✅ Firebase Authentication (Email/Password)
- ✅ User profile management with encrypted sensitive data
- ✅ Secure session management and token validation
- ✅ Profile creation and editing functionality

### 📝 Content Management

- ✅ Full CRUD operations for restaurant posts
- ✅ Rich post creation form with validation
- ✅ Multi-resolution image upload and optimization
- ✅ Post editing (owner-only) and deletion
- ✅ Responsive image serving via Cloudinary CDN

### 🌟 Social Features

- ✅ Like/Unlike posts with real-time counters
- ✅ "Want to Go" functionality for restaurant interest
- ✅ Share tracking and social engagement metrics
- ✅ User interaction history and preferences

### 🔍 Search & Discovery

- ✅ Advanced full-text search across posts and restaurants
- ✅ **AI-Enhanced Search** with Google Gemini integration
- ✅ Intelligent keyword extraction and query understanding
- ✅ AI-powered search suggestions and recommendations
- ✅ Tag-based filtering and content categorization
- ✅ Location-based search capabilities
- ✅ Voice search integration with Web Speech API
- ✅ Advanced filters with multiple search criteria

### ⭐ Rating System

- ✅ Restaurant rating system (Recommended, New, So-so)
- ✅ Visual rating displays and components
- ✅ Rating integration with post creation

### 🏷️ Tagging System

- ✅ Dynamic tag creation and management
- ✅ Tag-based search and filtering
- ✅ Visual tag display components

### 🎙️ Voice Features

- ✅ Web Speech API integration
- ✅ Voice-to-text for search and content creation
- ✅ Real-time speech transcription

### 💳 Payment Integration

- ✅ Stripe Checkout for donation functionality
- ✅ CAD currency support
- ✅ Secure payment processing

### 📱 User Interface & Experience

- ✅ Mobile-first responsive design
- ✅ Accessibility features (ARIA, keyboard navigation)
- ✅ Loading states and error handling
- ✅ Hero sections and compelling imagery
- ✅ Touch-friendly interface elements

### 🧪 Testing & Quality Assurance

- ✅ Comprehensive Playwright E2E test suite
- ✅ Unit testing setup with Vitest
- ✅ Code quality enforcement with ESLint
- ✅ Error boundaries and comprehensive error handling

## 🛠️ Tech Stack

**Frontend**: React 19 + Vite, TailwindCSS + DaisyUI, Apollo Client, Redux Toolkit  
**Backend**: Node.js + Express, Apollo Server, GraphQL  
**Database**: MongoDB + Mongoose ODM  
**Authentication**: Firebase Auth  
**AI Services**: Google Gemini AI  
**Payments**: Stripe  
**Storage**: Cloudinary CDN  
**Testing**: Playwright E2E + Vitest Unit Tests

> 📋 **For complete technology details**: See [TECH_STACK.md](./TECH_STACK.md)

### 🗄️ Performance Features

- **Apollo Cache**: InMemoryCache with smart pagination and field-level optimization
- **Real-time Updates**: Optimistic UI updates for likes, shares, and interactions
- **CDN Integration**: Cloudinary for optimized image delivery
- **Code Splitting**: Bundle optimization for faster load times

### 🤖 AI-Enhanced Search

- **Google Gemini Integration**: Natural language query processing
- **Smart Keyword Extraction**: Converts complex queries into relevant search terms
- **Intelligent Fallback**: Graceful degradation when AI services unavailable
- **Context-Aware Results**: Enhanced search suggestions based on user intent

## 🚧 Development Setup

**Prerequisites**: Node.js 18+, MongoDB, Firebase project, Cloudinary account

```bash
git clone <repository-url> && cd CapstoneProject
cd server && npm install && npm start  # Backend (port 3500)
cd client && npm install && npm run dev  # Frontend (port 5173)
```

> 🔧 **For detailed setup**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🧪 Testing

```bash
# Unit tests
cd client && npm run test

# End-to-End tests
cd client && npm run test:e2e
```

**Coverage**: Authentication, CRUD operations, search, social features, responsive design

## 📦 Deployment

**Production**: Vercel (Frontend + Backend), MongoDB Atlas, Cloudinary CDN  
**Build**: `npm run build` with code splitting optimization

> 🚀 **Live Application**: See links in the Live Application section above
