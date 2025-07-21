const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/account.controller")
const multer  = require('multer')
// const storageMutler = require("../../helpers/storageMulter")
const validate = require("../../validates/admin/account.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")



// //multer
// const upload = multer({ storage: storageMutler()})

const upload = multer()


route.get('/', controller.index)
route.get('/create', controller.create)
route.post(
    '/create',
    upload.single("avatar"), 
    uploadCloud.upload,
    validate.createPost, 
    controller.createPost)
// route.get('/edit/:id', controller.edit)
// route.patch('/edit/:id', controller.editPatch)
// route.get('/permissions', controller.permissions)
// route.patch('/permissions', controller.permissionsPatch)

module.exports = route