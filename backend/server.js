require('dotenv').config();

// ✅ Validate critical environment variables at startup
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ CRITICAL: Missing required environment variable: ${key}`);
    console.error('Please set it in your Render Environment settings.');
  } else {
    console.log(`✅ ${key} is set`);
  }
});

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Start Server first so Render sees it as live
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

// Then connect to Database (non-blocking)
connectDB();

// Handle unhandled promise rejections - log but don't exit
process.on('unhandledRejection', (err) => {
  console.error(`⚠️ Unhandled Rejection: ${err.message}`);
});

