const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
const Chat = require("../../models/chat.model")

module.exports = (req, res) => {
    // socket
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id)
        socket.join(req.params.roomChatId)
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {

        let images = []
        for(const imageBuffer of data.images){
            const link = await uploadToCloudinary.uploadToCloudinary(imageBuffer)
            images.push(link)
        }

        const chat = new Chat({
            user_id: userId,
            content: data.content,
            images: images,
            room_chat_id: req.params.roomChatId
        })
        await chat.save()

        //return data to client
        _io.to(req.params.roomChatId).emit("SERVER_RETURN_MESSAGE", {
            userId: userId,
            fullName: fullName,
            content: data.content,
            images: images
        })
        })
        socket.on("CLIENT_SENT_TYPING", async (type) => {
        // console.log(type)
        socket.broadcast.to(req.params.roomChatId).emit("SERVER_RETURN_TYPING", {

            userId: userId,
            fullName: fullName,
            type: type
        })
        })
    })
    // end socket
}
