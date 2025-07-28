
const mongoose = require("mongoose")

const roomsChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [
        {
            user_id: String,
            role: String
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    position: Number
}, {
    timestamps: true
})

const RoomsChat = mongoose.model("RoomChat", roomsChatSchema, "rooms-chat")

module.exports = RoomsChat