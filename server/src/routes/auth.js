const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, authController.getUser);

module.exports = router; 