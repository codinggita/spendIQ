const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ResponseHandler = require('../utils/responseHandler');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    console.log('[REGISTER] Attempt:', email);

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('[REGISTER] Email already exists:', email);
      return ResponseHandler.error(res, 'Email already exists', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || null
    });

    const token = generateToken(user._id);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    console.log('[REGISTER] ✅ Success:', email);
    return ResponseHandler.created(res, { user: userData, token }, 'User registered successfully');

  } catch (error) {
    console.error('[REGISTER] ❌ Error:', error.message);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      detail: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Attempt:', email);

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('[LOGIN] User not found:', email);
      return ResponseHandler.error(res, 'Invalid email or password', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[LOGIN] Wrong password for:', email);
      return ResponseHandler.error(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log('[LOGIN] ✅ Success:', email);
    return ResponseHandler.success(res, { user: userData, token }, 'Login successful');

  } catch (error) {
    console.error('[LOGIN] ❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      detail: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return ResponseHandler.error(res, 'User not found', 404);
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    };

    return ResponseHandler.success(res, { user: userData });
  } catch (error) {
    console.error('[GET_ME] ❌ Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
};
