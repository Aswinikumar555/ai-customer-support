const Chat = require('../models/Chat');
const aiService = require('../services/ai');

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    console.log('Chat request received:', req.body);
    const { chatId, message } = req.body;
    const userId = req.user.id;
    console.log('User ID:', userId);

    let chat;

    // If chatId is provided, find existing chat, otherwise create a new one
    if (chatId) {
      console.log('Finding existing chat:', chatId);
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        console.log('Chat not found with ID:', chatId);
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      console.log('Creating new chat');
      chat = new Chat({
        userId,
        title: `Chat ${new Date().toLocaleDateString()}`,
        messages: []
      });
    }

    // Add user message to chat
    console.log('Adding user message to chat');
    chat.messages.push({
      sender: 'user',
      content: message
    });

    // Prepare conversation history for AI
    console.log('Preparing conversation history');
    const conversationHistory = chat.messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Get AI response
    console.log('Requesting AI response');
    try {
      const aiResponse = await aiService.generateResponse(conversationHistory);
      console.log('AI response received');

      // Add AI response to chat
      chat.messages.push({
        sender: 'ai',
        content: aiResponse
      });

      // Save updated chat
      console.log('Saving chat to database');
      await chat.save();

      // Return the updated chat
      console.log('Sending response to client');
      res.json(chat);
    } catch (aiError) {
      console.error('AI Service Error:', aiError);
      return res.status(500).json({ 
        message: 'AI Service Error', 
        error: aiError.message 
      });
    }
  } catch (err) {
    console.error('Chat error:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching chat history for user:', userId);
    
    // Find all chats for this user
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 });
    
    console.log(`Found ${chats.length} chats`);
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a specific chat
exports.getChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.id;
    console.log('Fetching chat:', chatId, 'for user:', userId);
    
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      console.log('Chat not found with ID:', chatId);
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (err) {
    console.error('Error fetching chat:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 