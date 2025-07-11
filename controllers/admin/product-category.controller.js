const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")

module.exports.index = async (req, res) => {

  let find = {
    deleted: false
  }

  const records = await ProductCategory.find(find)
  res.render('admin/pages/products-category/index', 
    { 
      title: 'Products Category', 
      records: records
    })
    // res.send("Welcome to list product analysis!")
  }

// [GET] /admin/products-category/create
  module.exports.create = async (req, res) => {
    

    res.render('admin/pages/products-category/create', 
    { 
      title: 'Products Category Create'
    })
    // res.send("Welcome to list product analysis!")
  }

  //[POST] admin/products/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments()
        req.body.position = count + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }
    const record = new ProductCategory(req.body)
    await record.save()

    req.flash("success", `This product has already been created!`)
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)

}