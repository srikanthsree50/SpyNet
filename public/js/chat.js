
const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#share-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username,chatroom} = Qs.parse(location.search, {ignoreQueryPrefix : true})

const autoScroll = () => {
const $newMessage = $messages.lastElementChild

const newMessageStyles = getComputedStyle($newMessage) 
const newMessageMargin = parseInt(newMessageStyles.marginBottom) 
const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

const visibleHeight = $messages.offsetHeight
const containerHeight = $messages.scrollHeight
const scrollOffset = $messages.scrollTop + visibleHeight

if(containerHeight - newMessageHeight <= scrollOffset){
    $messages.scrollTop = $messages.scrollHeight
}


}

socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
autoScroll()

socket.on('roomData',({chatroom,users}) => {
const html = Mustache.render(sidebarTemplate,{
  chatroom,
  users  
})
document.querySelector('#sidebar').innerHTML = html
})

})

$messageForm.addEventListener('submit',(e) => {
   e.preventDefault()

   $messageFormButton.setAttribute('disabled','disabled')

   const message = e.target.elements.message.value

    socket.emit('sendMessage',message , (error) => {

$messageFormButton.removeAttribute('disabled')
$messageFormInput.value = ''
$messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('the message was delivered')
    })
})

$shareLocationButton.addEventListener('click',() => {
if(!navigator.geolocation){
    return 'geolocation is not supported by your browser...'
}
$shareLocationButton.setAttribute('disabled','disabled')
navigator.geolocation.getCurrentPosition((position) => {

    socket.emit('sharelocation',{ 
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
    },() => {
        $shareLocationButton.removeAttribute('disabled')
        console.log('location shared...')
    })
})

})


socket.emit('join',{username,chatroom}, (error) => {
     if(error) {
         alert(error)
         location.href ='/'
     }
})