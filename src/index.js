const port = process.env.PORT || 8080
const path = require('path');
const express = require('express');
const app = express();
const {generateMessage} = require('./utils/messages')
const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server)
const bad = require('bad-words')
const publicDirectryPath = path.join( __dirname , '../public');
app.use(express.static(publicDirectryPath));


io.on('connection',(socket) => {
    console.log('new connection...');

socket.emit('message',generateMessage('welcome'))

socket.broadcast.emit('message',generateMessage('A new user has been joined...'))

socket.on('sendMessage',(message,callback) => {
    const filter = new bad()

    if(filter.isProfane(message)){
        return callback('profanity is not allowed')
    }

    io.emit('message',generateMessage(message))

    callback()
})

socket.on('sharelocation' , (coords,callback) => {
    io.emit('locationMessage',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
callback()
})

socket.on('disconnect' , () => {
    io.emit('message',generateMessage('A user has left...'))
})

})

server.listen(port,() => {
    console.log(`server running at ${port}.....`)
}) 