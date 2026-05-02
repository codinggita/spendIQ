const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const smsRoutes = require('./routes/smsRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

// Security Middlewares
app.use(helmet());

// Support multiple comma-separated origins e.g. "https://myapp.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin} is not allowed`));
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SpendIQ API' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
