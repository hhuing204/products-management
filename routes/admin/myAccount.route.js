const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/myAccount.controller")
const multer  = require('multer')
// const storageMutler = require("../../helpers/storageMulter")
const validate = require("../../validates/admin/account.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")


const upload = multer()

route.get('/', controller.index)
route.get('/edit', controller.edit)
route.patch(
    '/edit',
    upload.single("avatar"), 
    uploadCloud.upload,
    validate.editPatch, 
    controller.editPatch)

module.exports = route