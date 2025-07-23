const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/search.controller")

route.use('/', controller.index)

module.exports = route