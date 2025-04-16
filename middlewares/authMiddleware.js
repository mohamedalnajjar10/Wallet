const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');

exports.protect = async (req, res, next) => {
  try {
    // 1) Check if token exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findByPk(decoded.userId);
    if (!currentUser) {
      return next(new ApiError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new ApiError('User recently changed password! Please log in again.', 401));
      }
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(new ApiError('Invalid token. Please log in again!', 401));
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }
    next();
  };
}; 