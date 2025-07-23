const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")
//[GET]
module.exports.index = async (req, res) => {

  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }) 
  const newProducts = productHelper.newPriceProducts(productsFeatured)
  
  
  res.render('client/pages/home/index', { 
    title: 'Homepage', 
    productsFeatured: newProducts
  })
}
