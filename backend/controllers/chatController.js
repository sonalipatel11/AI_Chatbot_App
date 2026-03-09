const Chat = require('../models/Chat');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || 'dummy_key',
  baseURL: "https://api.groq.com/openai/v1"
});

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const newChat = new Chat({
      user: req.user.id,
      title: req.body.title || 'New Chat',
      messages: []
    });
    const chat = await newChat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    console.log(`[CHAT] Send message to chat: ${req.params.id} by user: ${req.user.id}`);
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user.id });
    if (!chat) {
      console.warn(`[CHAT] Chat not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Chat not found' });
    }

    const userMessage = { role: 'user', content: req.body.message };
    chat.messages.push(userMessage);

    // Prepare context for OpenAI
    const openAiMessages = chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate title if it's the first message
    if (chat.messages.length === 1 && chat.title === 'New Chat') {
      chat.title = req.body.message.substring(0, 30) + (req.body.message.length > 30 ? '...' : '');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: openAiMessages,
      });

      const aiMessage = {
        role: 'assistant',
        content: completion.choices[0].message.content
      };

      chat.messages.push(aiMessage);
      await chat.save();

      res.json(chat);
    } catch (apiErr) {
      console.error("Groq API Error:", apiErr.message || apiErr);
      // Mock response if API key is not valid or other API error
      const mockMessage = {
        role: 'assistant',
        content: `I am a mocked AI response because there was an issue calling the AI API (${apiErr.message}). Please check your API key.`
      };
      chat.messages.push(mockMessage);
      await chat.save();
      res.json(chat);
    }
  } catch (err) {
    console.error("SendMessage Outer Error:", err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};