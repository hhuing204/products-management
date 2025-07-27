const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
// [GET] /chat/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    // console.log(res.locals.user)
    // socket
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id)
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {

          let images = []
          for(const imageBuffer of data.images){
            const link = await uploadToCloudinary.uploadToCloudinary(imageBuffer)
            images.push(link)
          }

          const chat = new Chat({
              user_id: userId,
              content: data.content,
              images: images
          })
          await chat.save()

          //return data to client
          _io.emit("SERVER_RETURN_MESSAGE", {
              userId: userId,
              fullName: fullName,
              content: data.content,
              images: images
          })
        })
        socket.on("CLIENT_SENT_TYPING", async (type) => {
          // console.log(type)
          socket.broadcast.emit("SERVER_RETURN_TYPING", {
            userId: userId,
            fullName: fullName,
            type: type
          })
        })
      })
    // end socket


      const chats = await Chat.find({
        deleted: false
      })

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
