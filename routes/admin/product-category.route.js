const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/product-category.controller")



const multer  = require('multer')
// const storageMutler = require("../../helpers/storageMulter")
const validate = require("../../validates/admin/product-category.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")
const ProductCategory = require('../../models/product-category.model')



// //multer
// const upload = multer({ storage: storageMutler()})

const upload = multer()



route.get('/', controller.index)

route.patch("/change-status/:status/:id", controller.changeStatus)
// route.patch("/change-multi", controller.changeMulti)
route.delete("/delete/:id", controller.deleteItem)

route.get('/create', controller.create)
route.post(
    "/create", 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)
route.get('/edit/:id', controller.edit)
route.patch(
    "/edit/:id", 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
)



module.exports = route