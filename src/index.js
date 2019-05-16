const port = process.env.PORT || 8080
const path = require('path');
const express = require('express');
const app = express();

const {generateMessage,generateLocationMessage} = require('./utils/messages')
const { AddUser,RemoveUser,GetUser,getUserRooms } = require('./utils/users')

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server)
const bad = require('bad-words')
const publicDirectryPath = path.join( __dirname , '../public');
app.use(express.static(publicDirectryPath));


io.on('connection',(socket) => {
    console.log('new connection...');

socket.on('join', (options, callback) => {
  const {error,user} = AddUser({id:socket.id,...options})

   if(error){
     return  callback(error)
   }
socket.join(user.chatroom)

socket.emit('message',generateMessage('Admin','welcome'))
socket.broadcast.to(user.chatroom).emit('message',generateMessage('Admin',`${user.username} has joined`))
io.to(user.chatroom).emit('roomData',{
    chatroom:user.chatroom,
    users:getUserRooms(user.chatroom)
})
callback()
})

socket.on('sendMessage',(message,callback) => {
    const user = GetUser(socket.id)
    const filter = new bad()

    if(filter.isProfane(message)){
        return callback('profanity is not allowed')
    }

    io.to(user.chatroom).emit('message',generateMessage(user.username,message))

    callback()
})

socket.on('sharelocation' , (coords,callback) => {
    const user = GetUser(socket.id)
    io.to(user.chatroom).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
callback()
})

socket.on('disconnect' , () => {
    const user = RemoveUser(socket.id)
    if(user){
    io.to(user.chatroom).emit('message',generateMessage('Admin',`${user.username}  has left...`))
    io.to(user.chatroom).emit('roomData',{
        chatroom:user.chatroom,
        users:getUserRooms(user.chatroom)
    })
    }
})

})

server.listen(port,() => {
    console.log(`server running at ${port}.....`)
}) 