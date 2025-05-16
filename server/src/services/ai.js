
const axios = require('axios');

class AIService {
  constructor() {
    // Hardcode the API key directly
    this.apiKey = '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';
    this.baseURL = 'https://openrouter.ai/api/v1';
    console.log('Using hardcoded API key in AIService constructor');
  }

  async generateResponse(messages) {
    console.log('generateResponse called with', messages.length, 'messages');
    
    try {
      console.log('Making request to OpenRouter API');
      console.log('API Key present:', !!this.apiKey);
      
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'AI Customer Support'
          }
        }
      );

      console.log('OpenRouter API response status:', response.status);
      
      // Extract the AI's response text
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:');
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`OpenRouter API error: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response received from OpenRouter API');
      } else {
        console.error('Error message:', error.message);
        throw new Error('Failed to make request');
      }
    }
  }
}

module.exports = new AIService(); 