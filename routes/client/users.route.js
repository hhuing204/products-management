const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/users.controller")

route.use('/not-friend', controller.notFriend)
route.use('/request', controller.request)
route.use('/accept', controller.accept)
route.use('/friends', controller.friends)


module.exports = route