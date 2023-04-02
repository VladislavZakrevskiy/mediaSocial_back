require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const ws = require('ws')

const authRouter = require('./routes/authRouter')
const publicRouter = require('./routes/publicRouter')
const userRouter = require('./routes/userRouter')
const postsRouter = require('./routes/postsRouter')
const chatRoutes = require('./routes/chatRoutes')
const imageRoutes = require('./routes/imageRouter')

const errorMiddleware = require('./middleware/errorMiddleware')
const chatService = require('./service/chatService')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/public', publicRouter)
app.use('/posts', postsRouter)
app.use('/chat', chatRoutes)
app.use('/images', imageRoutes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000 

const start = async () => {
    try {
        app.listen(PORT, ()=> console.log('server start on PORT = '+ PORT))
    } catch (e) {
        console.log(e)
    } 
}
start()


const wss = new ws.Server({
    port: 3001,
    
}, ()=> console.log('ws server on 3001 p'))

wss.on('connection',async function connection(ws){
    const chats = await chatService.getAllChatIds()
    
    ws.on('message', function (msg){
        msg = JSON.parse(msg)
        switch(msg.event){
            case 'message':
                chatService.sendMessage(msg.chat_id, msg.from_id, msg.body, msg.id)
                toAllClients(msg)
                break;
            case 'connection':
                ws.chat_id = msg.chat_id
                ws.from_id = msg.from_id
                toAllClients(msg)
                break
        }
    })
})



function toAllClients (msg) {
        wss.clients.forEach(client=> {
            if(msg.chat_id == client.chat_id){
                client.send(JSON.stringify(msg))
            }
        })
}