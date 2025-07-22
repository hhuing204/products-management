const Products = require("../../models/product.model")
const Account = require("../../models/account.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
const ProductCategory = require("../../models/product-category.model")
//[GET] admin/products

module.exports.products = async (req, res) => {
  let find = {
    deleted: false
  }
  
  if(req.query.status){
    find.status = req.query.status
  }
  
  const filterStatus = filterStatusHelper(req.query)
  const searchObj = searchHelper(req.query)
  
  const keyword = searchObj.keyword
  if (searchObj.regex) {
    find.title = searchObj.regex
  }

  // sort
  let sort = {}

  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc"
  }
  
  //pagination
  const countProducts = await Products.countDocuments(find)
  let objectPagination = paginationHelper(
    {
    currentPage: 1,
    limitItems: 4
    },
    req.query,
    countProducts
  )




  const products = await Products.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for(const product of products){
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    })
    if(user){
      product.accountFullName = user.fullName
    }
    //lay nguoi chinh sua gan nhat
    const updatedBy = product.updatedBy[product.updatedBy.length-1]
    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      })

      updatedBy.accountFullName = userUpdated.fullName
      // product.updatedBy = updatedBy
    }
  }

  
  
  res.render('admin/pages/products/index', 
  { 
    title: 'Products', 
    message: 'Welcome to Dashboard', 
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination
  })
  // res.send("Welcome to list product analysis!")
}

//[PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status
  const id = req.params.id
  

  await Products.updateOne({_id: id}, {status: status})
  
  req.flash("success", "The status of this product updated already!")

  const backURL = req.get('referer') || '/admin/products';
  res.redirect(backURL)
}

//[PATCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  console.log(req.body)
  const type = req.body.type
  const ids = req.body.ids.split(", ")
  

  switch (type) {
    case "active":
      await Products.updateMany( {_id: { $in: ids}}, {status: "active"})
      req.flash("success", `${ids.length} products updated already on status!`)
      break
    case "inactive":
      await Products.updateMany( {_id: { $in: ids}}, {status: "inactive"})
      req.flash("success", `${ids.length} products updated already on status!`)
      break
    case "delete-all":
      await Products.updateMany( {_id: { $in: ids}}, {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      })
      req.flash("success", `${ids.length} products have been deleted already!`)
      break
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-")
        position = parseInt(position)
        await Products.updateOne({_id: id}, {
          position: position
        })

      }
      req.flash("success", `${ids.length} products have been changed position already!`)
      break
    default: 
      break
  }
  const backURL = req.get('referer') || '/admin/products';
  res.redirect(backURL)
}



//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id

  //permanently delete
  // await Products.deleteOne({ _id: id})

  await Products.updateOne({_id: id}, {
    deleted: true,
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
  })

  req.flash("success", `This product has already been deleted!`)
  const backURL = req.get('referer') || '/admin/products';
  res.redirect(backURL)
}

//[GET] admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }


  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(records)

  res.render("admin/pages/products/create", {
    title: "Add a new product",
    records: newRecords
  })
}
//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  

  req.body.price =  Number(req.body.price)
  req.body.discountPercentage = Number(req.body.discountPercentage )
  req.body.stock = Number(req.body.stock)
  if(req.body.position == "") {
    const countProducts = await Products.countDocuments()
    req.body.position = countProducts + 1
  } else {
    req.body.position = Number(req.body.position)
  }

  // if(req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`
  // }
  
  // console.log("ok")

  req.body.createdBy = {
    account_id: res.locals.user._id
  }

  
  const product = new Products(req.body)
  // console.log(product)
  await product.save()

  req.flash("success", `This product has already been created!`)
  res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    
  
    const product = await Products.findOne(find)

    const records = await ProductCategory.find({
      deleted: false
    });
    const newRecords = createTreeHelper.createTree(records)
    // console.log(newRecords)
    
    res.render("admin/pages/products/edit", {
      title: "Edit a product",
      product: product,
      records: newRecords
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`)
    req.flash("error", `This product does not exist`)
  }
}

//[PATH] admin/products/edit/:id
module.exports.editPath = async (req, res) => {

  req.body.price =  Number(req.body.price)
  req.body.discountPercentage = Number(req.body.discountPercentage )
  req.body.stock = Number(req.body.stock)
  req.body.position = Number(req.body.position)

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  
  
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    // console.log(updatedBy)
    // req.body.updatedBy = updatedBy

    await Products.updateOne({
      _id: req.params.id
    }, {
      ...req.body,
      $push: {updatedBy: updatedBy}}
    )
    req.flash("success", `The product has been updated successfully!`)
    
  } catch (error) {
    console.log(error)
    req.flash("error", `The product update failed`)
  }
  const backURL = req.get('referer') || '/admin/products';
    res.redirect(backURL)
}


//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const product = await Products.findOne(find)
    
    res.render("admin/pages/products/detail", {
      title: product.title,
      product: product
    })
  } catch (error) {
    req.flash("error", `This product does not exist`)
    res.redirect(`${systemConfig.prefixAdmin}/products`)
    
  }
}