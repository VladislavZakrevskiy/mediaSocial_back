const chatService = require("../service/chatService")
const ChatService = require("../service/chatService")
const friendService = require("../service/friendService")
const userService = require("../service/userService")



class userController {
    async getMe(req,res, next) {
        try {
            const {email} = req.body
            const user = await userService.getMe(email)
            res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async getUsersByChatId (req,res,next) {
        try {
            const {from_id} = req.params
            const chat = await ChatService.getChatId(from_id)
            res.json(chat)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async createId(req,res,next) {
        try {
            const {chat_id, from_id, to_id} = req.body
            const chat = await ChatService.createChatId(chat_id, from_id, to_id)
            res.json(chat)
        } catch (e) {
            next(e)
        }
    }

    async getMessages(req,res,next){ 
        try {
            const {chat_id} = req.params
            const data = await chatService.getMessage(chat_id) 
            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    async findByName(req,res,next){ 
        try {
            const {name} = req.body
            const data = await userService.findByName(name) 
            res.json(data)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getUser(req,res,next){
        try {
            const {user_id} = req.params
            const response = await userService.getUser(user_id)
            res.json(response)
        } catch (e) {
            next(e)
            console.log(e)
        }
    }

    async getFriends(req,res,next){
        try {
            const {user_id} = req.params
            const response = await friendService.getFriends(user_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async addFriend(req,res,next){
        try {
            const {user_id, friend_id} = req.body
            const response = await friendService.addFriend(friend_id, user_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async removeFriend(req,res,next){
        try {
            const {user_id, friend_id} = req.body
            const response = await friendService.removeFriend(friend_id, user_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async activateFriend(req,res,next){
        try {
            const {user_id, friend_id} = req.body
            const response = await friendService.activateFriend(user_id, friend_id)
            res.json(response)
        } catch (e) {
            next(e)
            console.log(e)
        }
    }

    async getNotification(req,res,next){
        try {
            const {user_id} = req.params
            const response = await friendService.getNotifications(user_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async sendNotification(req,res,next){
        try {
            const {from_id, to_id, body, type} = req.body
            const response = await friendService.sendNotification(from_id, to_id, body, type)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async watchNotification(req,res,next){
        try {
            const {notification_id} = req.params
            const response = await friendService.watchNotification(notification_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async deleteNotification(req,res,next){
        try {
            const {notification_id} = req.params
            const response = await friendService.deleteNotification(notification_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async getNumberOfUnwatched(req,res,next ) {
        try { 
            const {user_id} = req.params
            const response = await friendService.getNumberOfUnwatched(user_id)
            res.json(response)
        } catch (e) {
            next(e)
            console.log(e)
        }
    }
}

module.exports = new userController()

