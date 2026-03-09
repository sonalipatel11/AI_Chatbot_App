import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Send, LogOut, MessageSquare, Plus, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const fetchChats = async () => {
    try {
      setError(null);
      const { data } = await api.get('/chat');
      setChats(data);
      if (data.length > 0 && !activeChat) setActiveChat(data[0]);
    } catch (err) {
      console.error("Fetch Chats Error:", err);
      setError("Failed to load chats. Please check your connection.");
    }
  };

  const createNewChat = async () => {
    try {
      setError(null);
      const { data } = await api.post('/chat', { title: 'New Chat' });
      setChats([data, ...chats]);
      setActiveChat(data);
    } catch (err) {
      console.error("Create Chat Error:", err);
      setError("Failed to create a new chat.");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const message = inputMessage;
    setInputMessage('');
    setLoading(true);
    setError(null);

    // Optimistic UI update
    const previousChat = activeChat;
    const updatedChat = { ...activeChat, messages: [...activeChat.messages, { role: 'user', content: message }] };
    setActiveChat(updatedChat);

    try {
      const { data } = await api.post(`/chat/${activeChat._id}/message`, { message });
      setActiveChat(data);
      setChats(chats.map(c => c._id === data._id ? data : c));
    } catch (err) {
      console.error("Send Message Error:", err);
      setError("Failed to send message. The assistant may be unavailable.");
      setActiveChat(previousChat); // Revert optimistic update
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-lg">AI Assistant</h2>
          <button onClick={createNewChat} className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <button
              key={chat._id}
              onClick={() => setActiveChat(chat)}
              className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-800 transition-colors ${activeChat?._id === chat._id ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}
            >
              <MessageSquare size={16} className="text-gray-400" />
              <span className="truncate text-sm">{chat.title}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <span className="text-sm truncate mr-2">{user?.name}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {error && (
          <div className="absolute top-0 left-0 right-0 z-50 p-2 bg-red-100 border-b border-red-200 text-red-700 flex items-center justify-center text-sm">
            <AlertCircle size={16} className="mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold hover:text-red-900">×</button>
          </div>
        )}
        {activeChat ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {activeChat.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p className="text-lg">Start a new conversation</p>
                </div>
              ) : (
                activeChat.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                      <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-none px-5 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t">
              <form onSubmit={sendMessage} className="flex space-x-2 w-full max-w-4xl mx-auto">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 border rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={20} className="m-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <button onClick={createNewChat} className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center shadow-lg hover:bg-blue-700 transition">
              <Plus size={20} className="mr-2" /> Create New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}