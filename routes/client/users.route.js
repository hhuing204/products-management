const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/users.controller")

route.use('/not-friend', controller.notFriend)
route.use('/request', controller.request)
route.use('/accept', controller.accept)


module.exports = route