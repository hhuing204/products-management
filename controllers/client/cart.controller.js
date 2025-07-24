
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model.js")
const newPriceHelper = require("../../helpers/product.js")

//[GET] /card
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId
    try {
        const cart = await Cart.findOne({_id: cartId})
        if(cart.products.length > 0){
            for (const item of cart.products) {
                const productId = item.product_id
                const productInfo = await Product.findOne({
                    _id: productId,
                    deleted: false,
                    status: "active"
                }).select("title thumbnail slug price discountPercentage")

                productInfo.priceNew = newPriceHelper.newPriceProduct(productInfo)
                item.productInfo = productInfo
                item.totalPrice = productInfo.priceNew * item.quantity
                
            }
        }
        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
        res.render("client/pages/cart/index", {
            title: "Cart",
            cart: cart
        })
    } catch (error) {
        console.log(error)
        res.redirect("products")
    }
    
}

//[POST]
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)
    const cartId = req.cookies.cartId

    const cart = await Cart.findOne({
        _id: cartId
    })

    const existProductsInCart = cart.products.find(item => item.product_id == productId)
    if (existProductsInCart) {
        const quantityNew = existProductsInCart.quantity + quantity

        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity" : quantityNew
            }
        })

    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne({_id: cartId}, {
            $push: {products: objectCart}
        })
    }

    
    req.flash("success", "Adding Succesfully")
    const backURL = req.get('referer') || 'product/detail/:productId';
    res.redirect(backURL)
}

//[GET] /delete/:id
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId

    await Cart.updateOne({_id: cartId}, {
        $pull: {products: {product_id: productId}}
    })


    req.flash("success", "Delete Completed")
    res.redirect("/cart")
}