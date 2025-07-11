const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/product-category.controller")



const multer  = require('multer')
// const storageMutler = require("../../helpers/storageMulter")
const validate = require("../../validates/admin/product-category.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")



// //multer
// const upload = multer({ storage: storageMutler()})

const upload = multer()



route.get('/', controller.index)

route.get('/create', controller.create)
route.post(
    "/create", 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    // validate.createPost,
    controller.createPost
)

module.exports = route