const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/home.controller")

route.use('/', controller.index)

module.exports = route