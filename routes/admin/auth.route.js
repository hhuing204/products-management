const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/auth.controller")
const validates = require("../../validates/admin/auth.validate")

route.get('/login', controller.login)
route.post(
    '/login',
    validates.loginPost, 
    controller.loginPost
)
route.get('/logout', controller.logout)

module.exports = route