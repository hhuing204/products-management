const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

//[GET] /search
module.exports.index = async (req, res) => {
    keyword = req.query.keyword
    // console.log(req)
    let newProducts = []
    if(keyword) {
        const regex = new RegExp(keyword, "i")
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        })
        newProducts = productHelper.newPriceProducts(products)
        res.render("client/pages/search/index", {
            title: `Result of ${keyword}`,
            keyword: keyword,
            products: newProducts
        })
    } else {
        res.redirect('/products')
    }
    
}
