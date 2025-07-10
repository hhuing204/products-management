const express = require('express')
const route = express.Router()
const controller = require("../../controllers/admin/product.controller")
const multer  = require('multer')
// const storageMutler = require("../../helpers/storageMulter")
const validate = require("../../validates/admin/product.validate")
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")



// //multer
// const upload = multer({ storage: storageMutler()})

const upload = multer()




route.get('/', controller.products)
route.patch("/change-status/:status/:id", controller.changeStatus)
route.patch("/change-multi", controller.changeMulti)
route.delete("/delete/:id", controller.deleteItem)
route.get("/create", controller.create)
route.post(
    "/create", 
    upload.single("thumbnail"), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)
route.get("/edit/:id", controller.edit)
route.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validate.createPost, 
    controller.editPath
)

route.get("/detail/:id", controller.detail)



module.exports = route