const chatService = require("../service/chatService")


class chatController {
    async createChatId(req, res, next){
        try {
            const {from_id, to_id} = req.body
            const response = await chatService.createChatId(from_id, to_id)
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}

module.exports = new chatController()