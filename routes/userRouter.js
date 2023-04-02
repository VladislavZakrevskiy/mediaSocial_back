const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/getMe/:id', userController.getMe)
router.get('/chatId/:from_id', userController.getUsersByChatId)
router.get('/messages/:chat_id', userController.getMessages)
router.post('/userPublic', userController.findByName)
router.get('/getUser/:user_id' , userController.getUser)
router.get('/getFriends/:user_id',userController.getFriends)
router.post('/addFriend',userController.addFriend)
router.delete('/removeFriend',userController.removeFriend)
router.patch('/activate', userController.activateFriend)
router.get('/getNotification/:user_id',userController.getNotification)
router.post('/sendNotification',userController.sendNotification)
router.get('/watchNotification/:notification_id',userController.watchNotification)
router.get('/deleteNotification/:notification_id', userController.deleteNotification)
router.get('/numUnWatched/:user_id', userController.getNumberOfUnwatched)


module.exports = router
