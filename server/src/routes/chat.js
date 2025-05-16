const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Apply auth middleware to all chat routes
router.use(auth);

// @route   POST /api/chat/send
// @desc    Send a message and get AI response
// @access  Private
router.post('/send', chatController.sendMessage);

// @route   GET /api/chat/history
// @desc    Get chat history for a user
// @access  Private
router.get('/history', chatController.getChatHistory);

// @route   GET /api/chat/:id
// @desc    Get a specific chat
// @access  Private
router.get('/:id', chatController.getChat);

module.exports = router; 