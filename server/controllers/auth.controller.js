// File: server/controllers/auth.controller.js

import User from '../models/user.model.js'; // Make sure the path is correct
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists');
  }

  // 2. Hash password (This part seems to be working for you)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // --- THIS IS THE MOST IMPORTANT PART ---
  console.log(`Attempting to log in user with email: ${email}`);

  // 1. Find the user by email in the database
  // We add .select('+password') in case you have `select: false` in your schema
  const user = await User.findOne({ email }).select('+password');
  
  // If we found a user AND the passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    console.log(`Login successful for user: ${user.email}`);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } else {
    // If user is not found or password doesn't match
    console.error(`Login failed for email: ${email}. User found: ${!!user}`);
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

export { registerUser, loginUser };