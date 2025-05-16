import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as chatService from '../services/chatService';

const Chat = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      const result = await chatService.getChatHistory();
      if (result.success) {
        setChatHistory(result.data);
      }
      setLoading(false);
    };

    fetchChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSending(true);
    const result = await chatService.sendMessage(message, currentChat?._id);
    
    if (result.success) {
      // If this is a new chat, add it to history
      if (!currentChat) {
        setChatHistory(prevHistory => [result.data, ...prevHistory]);
      } else {
        // Update existing chat in history
        setChatHistory(prevHistory =>
          prevHistory.map(chat => 
            chat._id === result.data._id ? result.data : chat
          )
        );
      }
      
      setCurrentChat(result.data);
      setMessage('');
    }
    
    setIsSending(false);
  };

  const handleSelectChat = async (chatId) => {
    if (currentChat?._id === chatId) return;
    
    setLoading(true);
    const result = await chatService.getChat(chatId);
    
    if (result.success) {
      setCurrentChat(result.data);
    }
    
    setLoading(false);
  };

  const handleNewChat = () => {
    setCurrentChat(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">AI Support</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        <button
          onClick={handleNewChat}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
        >
          New Chat
        </button>
        
        <h2 className="text-lg font-semibold mb-2">Chat History</h2>
        
        {loading && !currentChat ? (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            {chatHistory.length === 0 ? (
              <p className="text-gray-400 text-sm">No chat history yet</p>
            ) : (
              chatHistory.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`p-2 mb-2 rounded cursor-pointer ${
                    currentChat?._id === chat._id
                      ? 'bg-blue-700'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <p className="truncate">{chat.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(chat.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="mt-auto pt-4">
          <p className="text-sm text-gray-400">Logged in as:</p>
          <p className="font-semibold">{user?.username || user?.email}</p>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!currentChat ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">AI Customer Support</h2>
                <p className="text-gray-600 mb-4">How can I help you today?</p>
                <p className="text-sm text-gray-500">
                  Start a new conversation by typing a message below.
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {currentChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-3/4 mb-4 ${
                    msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-300 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div
                    className={`text-xs mt-1 text-gray-500 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-300 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:bg-blue-400"
            >
              {isSending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 