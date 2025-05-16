import axios from 'axios';

export const sendMessage = async (message, chatId = null) => {
  try {
    const response = await axios.post('/chat/send', { message, chatId });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to send message'
    };
  }
};

export const getChatHistory = async () => {
  try {
    const response = await axios.get('/chat/history');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch chat history'
    };
  }
};

export const getChat = async (chatId) => {
  try {
    const response = await axios.get(`/chat/${chatId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching chat:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch chat'
    };
  }
}; 