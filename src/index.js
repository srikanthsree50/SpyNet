const port = process.env.PORT || 8080
const path = require('path');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server)

const publicDirectryPath = path.join( __dirname , '../public');
app.use(express.static(publicDirectryPath));


io.on('connection',(socket) => {
    console.log('new connection...');

socket.emit('message','welcome')

socket.broadcast.emit('message','A new user has been joined...')

socket.on('sendMessage',(message) => {
    io.emit('message',message)
})

socket.on('sharelocation' , (coords) => {
    io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
})

socket.on('disconnect' , () => {
    io.emit('message','A user has left...')
})

})

server.listen(port,() => {
    console.log(`server running at ${port}.....`)
})