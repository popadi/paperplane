const conversationController = require('../controllers/conversation.controller');

const express = require('express');
const router = express.Router();

router.get('/getConversationByID', conversationController.getConversationByID);
router.post('/addMessageToConversation', conversationController.addMessageToConversation);

module.exports = router;