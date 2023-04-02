const db = require('../database/db')
const uuid = require('uuid')
const ApiError = require('../exceptions/apiError')

function getToIds(arr) {
    let array = []
    for(let i = 0;i<arr.length;i++) {
        array.push(arr[i].to_id)
    }
    return array
}

function getNumParams(arr) {
    let params = [];
    for(let i = 1; i <= arr.length; i++) {
        params.push('$' + i);
    }
    return params
}

function getDto(chat, users) {
    let arr = []
    for(let i = 0; i < chat.length; i++){
        arr.push({
            first_name: users[i].first_name ,
            last_name: users[i].last_name ,
            username: users[i].username ,
            chat_id: chat[i].chat_id,
            from_id: chat[i].from_id ,
            to_id: chat[i].to_id ,

        })
    }
    return arr
}

class ChatService {
    async getChatId(from_id){
        const candidate = await db.query('select * from chat where from_id = $1 or to_id = $1', [from_id])
        if(candidate.rows[0]){
            const to_user = await db.query(`select * from users where user_id in (${getNumParams(candidate.rows)})`, getToIds(candidate.rows))
            return getDto(candidate.rows, to_user.rows)
        }
        throw ApiError.badRequest('Чатов нет')
    }

    async createChatId(from_id, to_id){
        const candidate = await db.query('select * from chat where from_id = $1', [from_id])
        if(candidate.rows[0]){
            throw ApiError.badRequest('Чат есть')
        }
        const chat_id = uuid.v4()
        console.log({from_id, chat_id, to_id})
        const chat = await db.query('insert into chat (chat_id, from_id, to_id) values ($1,$2,$3) returning *', [chat_id, from_id, to_id])
        return chat.rows[0]
    }

    async getAllChatIds() {
        const response = await db.query('select * from chat')
        return response.rows
    }

    async sendMessage(chat_id, from_id, value, message_id){
        const {rows} = await db.query('select * from chat where chat_id = $1', [chat_id])
        let to_id = null
        if(rows[0].from_id == from_id){
            to_id = rows[0].to_id
        }
        else {
            to_id = rows[0].from_id
        }
        const response = await db.query('insert into messages (message_id, from_id, body, to_id) values ($1, $2, $3, $4) returning *', [message_id, from_id, value, to_id])
        return response.rows
        
    }

    async getMessage(chat_id){
        const response = await db.query('select * from messages where from_id = (select from_id from chat where chat_id = $1) and to_id = (select to_id from chat where chat_id = $1) or from_id = (select to_id from chat where chat_id = $1) and to_id = (select from_id from chat where chat_id = $1)', [chat_id])
        return response.rows
    }
}

module.exports = new ChatService()

