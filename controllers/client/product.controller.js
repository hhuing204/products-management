const Products = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")
const productHelper = require("../../helpers/product")
const ProductCategoryHelper = require("../../helpers/product-category")

module.exports.index = async (req, res) => {
  
    const products = await Products.find({
      deleted: false,
      status: "active"
    })
      .sort({position: "desc"})

    const newProducts = productHelper.newPriceProducts(products)


    
    // console.log(newProducts)
    res.render('client/pages/products/index', { 
      title: 'List products', products: newProducts })
  }

module.exports.detail = async (req, res) => {

  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active"
    }
  
    const product = await Products.findOne(find)
    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: "false"
      })

      product.category = category
      
    }

    product.priceNew = productHelper.newPriceProduct(product)
    
    res.render("client/pages/products/detail", {
      title: product.title,
      product: product
    })
  } catch (error) {
    console.log(error)
    req.flash("error", `This product does not exist`)
    res.redirect(`/products`)
    
  }
}

// [GET] /products/slugCategory
module.exports.category = async (req, res) => {
  
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      deleted: false,
      status: "active"
    })
    
  
    const childsCategory = await ProductCategoryHelper.getListChildCategory(category.id)
  
    const idChilds = childsCategory.map(item => item.id)
  
    // console.log(childsCategory)
    // res.send("OK")
  
    const products = await Products.find({
      product_category_id: {$in: [category.id, ...idChilds]},
      deleted:false,
      status: "active"
    }).sort({position: "desc"})
  
    const newProducts = productHelper.newPriceProducts(products)
  
    res.render("client/pages/products/index", {
      title: category.title,
      products: newProducts
    })
  } catch (error) {
    res.redirect("/products")
  }

}