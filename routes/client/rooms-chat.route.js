const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/rooms-chat.controller")
// const chatMiddleware = require("../../middlewares/client/chat.middleware")
// chatMiddleware.isAccess

route.get('/', controller.index)
route.get('/create', controller.create)
route.post('/create', controller.createPost)
module.exports = route