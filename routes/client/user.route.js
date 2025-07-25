const express = require('express')
const route = express.Router()
const controller = require("../../controllers/client/user.controller")
const userValidate = require("../../validates/client/user.validate")

route.get('/register', controller.register)
route.post('/register', userValidate.registerPost, controller.registerPost)
route.get('/login', controller.login)
route.post('/login',userValidate.loginPost, controller.loginPost)

module.exports = route