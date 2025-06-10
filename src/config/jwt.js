const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateOTPToken = (email, otp, type) => {
  return jwt.sign(
    { email, otp, type },
    process.env.JWT_SECRET,
    { expiresIn: '5m' } 
  );
};

const verifyOTPToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

module.exports = { generateOTPToken, verifyOTPToken };