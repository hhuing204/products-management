const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")
const chatSocket = require("../../sockets/client/chat.socket")

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id

  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted:false,
  })
    

    res.render("client/pages/roomsChat/index", {
        title: "Chat Rooms",
        listRoomChat: listRoomChat
    })
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendList = res.locals.user.friendList
    for (const friend of friendList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id,
            deleted: false
        }).select("fullName avatar")
        friend.infoFriend = infoFriend
    }
      
  
    res.render("client/pages/roomsChat/create.pug", {
        title: "Create a room chat",
        friendList: friendList
    })
  }

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title
    const usersId = req.body.usersId
    console.log(usersId)

    try {
        const dataRoom = {
            title: title,
            typeRoom: "group",
            users: []
        }
        if(typeof(usersId) != Array){
            dataRoom.users.push({
                user_id: usersId,
                role: "user"
            })
        } else {
            for(const userId of usersId) {
                dataRoom.users.push({
                    user_id: userId,
                    role: "user"
                })
            }
        }
        
        dataRoom.users.push({
            user_id: res.locals.user.id,
            role: "superAdmin"
        })
        const roomChat = new RoomChat(dataRoom)
        await roomChat.save()
    
        req.flash("success", "create a new room chat succesfully")
        res.redirect(`/chat/${roomChat.id}`)

    } catch (error) {
        console.log(error)
        res.redirect(`/rooms-chat/create`)
    }
}  


