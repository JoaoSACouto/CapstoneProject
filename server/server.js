require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cookieParser = require('cookie-parser');
const { smartAuth } = require('./middleware/auth');
const { merge } = require('lodash');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

// Utilities
const { createGraphQLContext } = require('./utils/graphqlContext');
const { ensureDefaultRatings, cleanupOrphanedPosts } = require('./utils/dbSeed');

// GraphQL imports
const typeDefs = require('./graphql/typeDefs');
const userResolvers = require('./graphql/userResolvers');
const postResolvers = require('./graphql/postResolvers/index');
const dateResolvers = require('./graphql/dateResolver');
const tagResolvers = require('./graphql/tagResolvers');

// Combine all resolvers
const resolvers = merge(
  userResolvers,
  postResolvers,
  dateResolvers,
  tagResolvers
);

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://localhost:4173',
  process.env.CLIENT_URL || 'https://capstone-project-amber-one.vercel.app',
  'https://studio.apollographql.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// REST Routes
const imageUploadRoute = require('./routes/imageUpload');
app.use('/api/upload-image', imageUploadRoute);

const ratingsRouter = require('./routes/ratings');
app.use('/api/ratings', ratingsRouter);

const postRoute = require('./routes/post');
app.use('/api/posts', postRoute);

const aiSearchRoute = require('./routes/aiSearch');
app.use('/api', aiSearchRoute);

const stripeRoute = require('./routes/stripe');
app.use('/api/payment', stripeRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Rate limiting for GraphQL
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Vercel-compatible handler
async function initServer() {
  await connectDB(); // MongoDB
  console.log('📊 Database connected');

  await server.start();
  console.log('🚀 Apollo Server started');

  await ensureDefaultRatings();
  await cleanupOrphanedPosts();

  app.use(
    '/graphql',
    limiter,
    smartAuth,
    expressMiddleware(server, { context: createGraphQLContext })
  );

  console.log('🔗 GraphQL middleware mounted');
}

initServer();

// Export Express app for Vercel
module.exports = app;
