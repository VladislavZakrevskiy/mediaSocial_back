const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const chatController = require('../controllers/chatController')
const router = express.Router()

router.post('/createChatId', authMiddleware, chatController.createChatId)

module.exports = router
