const Products = require("../../models/product.model")
const productHelper = require("../../helpers/product")

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
      slug: req.params.slug,
      status: "active"
    }
  
    const product = await Products.findOne(find)
    
    res.render("client/pages/products/detail", {
      title: product.title,
      product: product
    })
  } catch (error) {
    req.flash("error", `This product does not exist`)
    res.redirect(`/products`)
    
  }
}