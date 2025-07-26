const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/settings.controller")
const multer = require("multer")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")

const upload = multer()

route.get('/general', controller.general)
route.patch(
    '/general', 
    upload.single("logo"),
    uploadCloud.upload,
    controller.generalPatch
)


module.exports = route