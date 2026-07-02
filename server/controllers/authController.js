const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const TutorProfile = require('../models/TutorProfile');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    coordinates, // [lng, lat]
    address,
    // Student fields
    classGrade,
    schoolName,
    // Tutor fields
    subjects,
    classes,
    hourlyFee,
    experience,
    qualifications,
    availability
  } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Format location object
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'Please provide valid location coordinates [longitude, latitude]' });
    }

    const location = {
      type: 'Point',
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
    };

    // Create base user
    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
      address,
      isApproved: true
    });

    if (user) {
      // Create role-specific profiles
      if (role === 'student') {
        if (!classGrade) {
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({ success: false, message: 'Class grade is required for student registration' });
        }
        await StudentProfile.create({
          userId: user._id,
          classGrade,
          schoolName
        });
      } else if (role === 'tutor') {
        if (!subjects || !hourlyFee || experience === undefined || !qualifications) {
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({ success: false, message: 'All tutor profile details (subjects, fee, experience, qualifications) are required' });
        }
        await TutorProfile.create({
          userId: user._id,
          subjects: Array.isArray(subjects) ? subjects : [subjects],
          classes: Array.isArray(classes) ? classes : [classes],
          hourlyFee: parseFloat(hourlyFee),
          experience: parseInt(experience),
          qualifications,
          availability: availability || []
        });
      }

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user (must explicitly select password since it has select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profileDetails = null;

    if (user.role === 'student') {
      profileDetails = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === 'tutor') {
      profileDetails = await TutorProfile.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      user,
      profileDetails
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
