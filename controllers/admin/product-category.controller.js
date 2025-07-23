const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")

module.exports.index = async (req, res) => {

  let find = {
    deleted: false
  }


  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records)

  res.render('admin/pages/products-category/index', 
    { 
      title: 'Products Category', 
      records: newRecords
    })
    // res.send("Welcome to list product analysis!")
  }

// [GET] /admin/products-category/create
  module.exports.create = async (req, res) => {
    let find = {
      deleted: false
    }


    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.createTree(records)

    // console.log(newRecords)

    res.render('admin/pages/products-category/create', 
    { 
      title: 'Products Category Create',
      records: newRecords
    })
    // res.send("Welcome to list product analysis!")
  }

  //[POST] admin/products/create
module.exports.createPost = async (req, res) => {
    if(!res.locals.role.permissions.includes("products-category-create")){
      return
    }
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

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id

  try {
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    })
  
    const records = await ProductCategory.find({
      deleted: false
    });
  
    const newRecords = createTreeHelper.createTree(records)
  
    res.render('admin/pages/products-category/edit', 
    { 
      title: 'Edit Product Category',
      data: data,
      records: newRecords
    })
    
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
  }
  // res.send("Welcome to list product analysis!")
}


  //[PATCH] admin/products/edit/:id
  module.exports.editPatch = async (req, res) => {
    if(!res.locals.role.permissions.includes("products-category-edit")){
      return
    }
    const id = req.params.id

    req.body.position = parseInt(req.body.position)

    await ProductCategory.updateOne({
      _id: id
    }, req.body)

    // const record = new ProductCategory(req.body)
    // await record.save()

    req.flash("success", `This product has already been edited!`)
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)


}

//[PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  if(!res.locals.role.permissions.includes("products-category-edit")){
    return
  }
  const status = req.params.status
  const id = req.params.id

  await ProductCategory.updateOne({_id: id}, {status: status})
  
  req.flash("success", "The status of this product updated already!")

  const backURL = req.get('referer') || '/admin/products-category';
  res.redirect(backURL)
}

//[DELETE] admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  if(!res.locals.role.permissions.includes("products-category-edit")){
    return
  }
  const id = req.params.id

  //permanently delete
  // await Products.deleteOne({ _id: id})

  await ProductCategory.updateOne({_id: id}, {
    deleted: true,
    deletedAt: new Date()
  })

  req.flash("success", `This product has already been deleted!`)
  const backURL = req.get('referer') || '/admin/products-category';
  res.redirect(backURL)
}

