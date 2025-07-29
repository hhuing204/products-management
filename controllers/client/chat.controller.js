
const User = require("../../models/user.model")
const Chat = require("../../models/chat.model")
const chatSocket = require("../../sockets/client/chat.socket")
const RoomChat = require("../../models/rooms-chat.model")

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId
    
    // console.log(res.locals.user)
    
    chatSocket(req, res)


    const chats = await Chat.find({
      room_chat_id: roomChatId,
      deleted: false,
    })

    chats.infoGroup = await RoomChat.findOne({
      _id: roomChatId,
      deleted: false
    })
    // console.log(infoGroup)



    for (const chat of chats) {
      const infoUser = await User.findOne({
          _id: chat.user_id
      }).select("fullName")
      chat.infoUser = infoUser
    }

    res.render("client/pages/chat/index", {
        title: "Chat",
        chats: chats
    })
}
