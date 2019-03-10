const userController = require('../controllers/user.controller');

const express = require('express');
const router = express.Router();

router.get('/authenticate', userController.authenticate);
router.post('/createUser', userController.createUser);
router.get('/getUserByUsername', userController.getUserByUsername);
router.get('/getUserById', userController.getUserById);
router.get('/getAllUsers', userController.getAllUsers);
router.post('/updateAvatar', userController.updateAvatar);
router.post('/updateStatus', userController.updateStatus);
router.post('/sendFriendRequest', userController.sendFriendRequest);
router.post('/sendRequestAnswer', userController.sendRequestAnswer);
router.post('/createGroupConversation', userController.createGroupConversation);

router.get('/getUserAvatar', userController.getUserAvatar);
router.get('/getUserFriendRequestsAwait', userController.getUserFriendRequestsAwait);

module.exports = router;