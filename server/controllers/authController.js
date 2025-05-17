const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    studentNumber,
    staffNumber,
    faculty,
    campus,
  } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Check if student number exists (for students)
  if (role === "student") {
    const studentExists = await User.findOne({ studentNumber });
    if (studentExists) {
      res.status(400);
      throw new Error("Student number already in use");
    }
  }

  // Check if staff number exists (for staff)
  if (role === "lecturer" || role === "admin") {
    const staffExists = await User.findOne({ staffNumber });
    if (staffExists) {
      res.status(400);
      throw new Error("Staff number already in use");
    }
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    studentNumber: role === "student" ? studentNumber : undefined,
    staffNumber:
      role === "lecturer" || role === "admin" ? staffNumber : undefined,
    faculty: role === "student" || role === "lecturer" ? faculty : undefined,
    campus: role === "student" || role === "lecturer" ? campus : undefined,
  });

  if (user) {
    // Generate verification token
    const verificationToken = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: verificationToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email }); // Debug log

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check password
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Validate required fields
  if (!user.firstName || !user.lastName || !user.role) {
    console.error("User missing required fields:", {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
    res.status(400);
    throw new Error("User profile incomplete: missing firstName, lastName, or role");
  }

  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Return user data and token
  res.status(200).json({
    token,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    studentNumber: user.studentNumber || "",
    staffNumber: user.staffNumber || "",
    faculty: user.faculty || "",
    campus: user.campus || "",
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    studentNumber: user.studentNumber || "",
    staffNumber: user.staffNumber || "",
    faculty: user.faculty || "",
    campus: user.campus || "",
    isVerified: user.isVerified,
  });
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token, code } = req.body;

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Simulate verification (replace with actual logic)
  if (code !== "123456") {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  // Mark user as verified
  user.isVerified = true;
  await user.save();

  // Generate new auth token
  const authToken = generateToken(user._id);

  res.status(200).json({
    success: true,
    token: authToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      faculty: user.faculty,
      campus: user.campus,
      studentNumber: user.studentNumber,
      staffNumber: user.staffNumber,
    },
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email, token } = req.body;

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  // Simulate resending verification (replace with actual logic)
  res.status(200).json({
    success: true,
    message: "Verification code resent",
  });
});

// @desc    Get user profile (alternative endpoint)
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || !user._id) {
    console.error(
      `[${new Date().toISOString()}] getProfile: User not authenticated`,
      { user }
    );
    res.status(401);
    throw new Error("User not authenticated");
  }

  try {
    const userData = await User.findById(user._id).select("-password");
    if (!userData) {
      console.error(
        `[${new Date().toISOString()}] getProfile: User not found`,
        { userId: user._id }
      );
      res.status(404);
      throw new Error("User not found");
    }

    console.log(
      `[${new Date().toISOString()}] getProfile: User profile fetched`,
      {
        userId: userData._id,
        role: userData.role,
        faculty: userData.faculty || "",
      }
    );

    res.status(200).json({
      id: userData._id.toString(),
      name: `${userData.firstName} ${userData.lastName}`,
      role: userData.role,
      faculty: userData.faculty,
      studentNumber: userData.studentNumber,
      staffNumber: userData.staffNumber,
      campus: userData.campus,
      email: userData.email,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] getProfile: Error`, {
      error: error.message,
      stack: error.stack,
      userId: user?._id,
    });
    res.status(500);
    throw new Error("Failed to fetch user profile");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerification,
  getProfile,
};