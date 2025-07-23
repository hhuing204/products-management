
const Cart = require("../../models/cart.model")
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