/**
 * Configuration validation utility
 * Validates required environment variables and provides helpful error messages
 */

const validateEnvVars = () => {
  const requiredVars = {
    STRIPE_SECRET_KEY: 'Stripe secret key for payment processing',
    FRONTEND_URL: 'Frontend URL for Stripe redirects',
    MONGODB_URI: 'MongoDB connection string',
    FIREBASE_PROJECT_ID: 'Firebase project ID for authentication'
  };

  const missing = [];
  
  for (const [varName, description] of Object.entries(requiredVars)) {
    if (!process.env[varName]) {
      missing.push(`${varName}: ${description}`);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(msg => console.error(`   - ${msg}`));
    console.error('\n💡 Please check your .env file and ensure all required variables are set.');
    
    // Don't exit in development, but warn
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are configured');
  }
};

const getConfig = () => {
  return {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    frontend: {
      url: process.env.FRONTEND_URL || 'http://localhost:5173',
    },
    database: {
      uri: process.env.MONGODB_URI,
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    ai: {
      geminiKey: process.env.GEMINI_API_KEY,
      geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    }
  };
};

module.exports = {
  validateEnvVars,
  getConfig
};
