const users = []

const AddUser = ({id,username,chatroom}) => {
username = username
chatroom = chatroom

if(!username || !chatroom){
    return {
       error : 'username and chatroom required..'
        
    }
}

const existinguser = users.find((user) => {
    return user.chatroom === chatroom && user.username === username
})

if(existinguser){
    return {
        error : 'username already exists'
    }
}

const user = {id,username,chatroom}
users.push(user)

return { user }
}

const RemoveUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
        if(index !== -1){
            return users.splice(index,1)[0]
        }
}

const GetUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserRooms = (chatroom) => {
 chatroom = chatroom.trim().toLowerCase()
return users.filter((user) => user.chatroom === chatroom)
}

module.exports ={
    AddUser,
    RemoveUser,
    GetUser,
    getUserRooms
}