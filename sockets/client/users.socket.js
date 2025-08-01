const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")

module.exports = (res) => {
    _io.once('connection', (socket) => {
        //send request
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(`${myUserId}, ${userId}`)

            //adding A's id -> B's accept friends
            const existIdinRes = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (!existIdinRes) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {acceptFriends: myUserId}
                })
            }
            //adding B's id -> A's request friends
            const existIdinReq = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            // console.log(existIdinReq)
            if (!existIdinReq) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {requestFriends: userId}
                })
            }
            //length of acceptFriends
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            //get A's info return to B
            const infoUserA = await User.findOne({
                _id: myUserId,
            }).select("id avatar fullName")
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })
        })


        //cancel request
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(`${myUserId}, ${userId}`)

            //delete A's id -> B's accept friends
            const existIdinRes = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (existIdinRes) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {acceptFriends: myUserId}
                })
            }
            //adding B's id -> A's request friends
            const existIdinReq = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            
            if (existIdinReq) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {requestFriends: userId}
                })
            }
            //length of acceptFriends
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            //get Id A -> B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userIdB: userId,
                userIdA: myUserId
            })
        })


        //delete accept
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            //delete A's id -> B's accept friends
            const existIdinRes = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (existIdinRes) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {acceptFriends: userId}
                })
            }
            //adding B's id -> A's request friends
            const existIdinReq = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            
            if (existIdinReq) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {requestFriends: myUserId}
                })
            }
        })

        //accept request
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id 

            // console.log(`${myUserId}, ${userId}`)

            //check exist
            const existIdinRes = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            const existIdinReq = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            //end check
            
            //init room chat
            let roomChat
            if(existIdinReq && existIdinRes){
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ],
                }
                roomChat = new RoomChat(dataRoom)
                await roomChat.save()
            }
            
            //end init roomchat

            
            //add userId, roomchatid (if they have) in A -> friendlist of B
            //delete A's id -> B's accept friends
            if (existIdinRes) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {acceptFriends: userId}
                })
            }
            //add userId, roomchatid (if they have) in B -> friendlist of A
            //adding B's id -> A's request friends
            
            
            if (existIdinReq) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {requestFriends: myUserId}
                })
            }
        })
    })
    // end socket
}
