const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.error(`User not found for ID: ${decoded.id}`);
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      console.log('Authenticated user:', { id: req.user._id, name: req.user.name, role: req.user.role });
      next();
    } catch (error) {
      console.error('Authentication error:', {
        message: error.message,
        token: token ? 'Provided' : 'Not provided',
        stack: error.stack,
      });
      res.status(401);
      throw new Error('Not authorized, token verification failed');
    }
  } else {
    console.error('No token provided in request headers');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };