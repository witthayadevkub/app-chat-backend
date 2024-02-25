const { Server } = require('socket.io')
const http = require('http') 
const express =require('express')

 const app = express()

 const server = http.createServer(app)
 const io = new Server(server,{
    cors:{
        origin: ['']
    }
})

const getReceiverSocketId = (receiverId) =>{
    return userSocketMep[receiverId]
}

const userSocketMep ={}

io.on('connection', (socket)=>{
    console.log('a user connected',socket.id)
    const userId = socket.handshake.query.userId
    // console.log(userId)
    if(userId != "undefined"){
        userSocketMep[userId] = socket.id
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMep))

    socket.on('disconnect', ()=>{
        console.log('a user disconnected',socket.id)
        delete userSocketMep[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMep));
        // userSocketMep[userId] = socket.id
    })
})



module.exports = { app, server, io, getReceiverSocketId}