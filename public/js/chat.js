const socket = io()

socket.on('message',(msg) => {
    console.log(msg)
})
document.querySelector('#message-form').addEventListener('submit',(e) => {
   e.preventDefault()
   const message = e.target.elements.message.value
    socket.emit('sendMessage',message)
})

document.querySelector('#share-location').addEventListener('click',() => {
if(!navigator.geolocation){
    return 'geolocation is not supported by your browser...'
}

navigator.geolocation.getCurrentPosition((position) => {

    socket.emit('sharelocation',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
    })
})

})
