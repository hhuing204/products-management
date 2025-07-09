const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/dashboard.controller")

route.use('/', controller.dashboard)

module.exports = route