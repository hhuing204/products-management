
// [GET] /chat/
module.exports.index = async (req, res) => {
    // socket
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id)
      })
    // end socket
    res.render("client/pages/chat/index", {
        title: "Chat"
    })
}
