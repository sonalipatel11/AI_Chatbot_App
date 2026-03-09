const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, chatController.getAllChats);
router.post('/', auth, chatController.createChat);
router.post('/:id/message', auth, chatController.sendMessage);

module.exports = router;