
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model.js")
const newPriceHelper = require("../../helpers/product.js")
const Order = require("../../models/oder.model.js")

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
                item.totalPrice = Number((productInfo.priceNew * item.quantity).toFixed(2))
            }
        }
        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
        res.render("client/pages/checkout/index", {
            title: "Checkout",
            cart: cart
        })
    } catch (error) {
        console.log(error)
        res.redirect("products")
    }
    
}

//[POST] /card/order
module.exports.orderPost = async (req, res) => {
  
  try {
    const cartId = req.cookies.cartId
    const userInfo = req.body

    const cart = await Cart.findOne({_id:cartId})

    const products = []
    for(const product of cart.products){
      const objectProduct = {
        product_id: product.product_id,
        price:0,
        discountPercentage: 0,
        quantity: product.quantity
      }


      const productInfo = await Product.findOne({
        _id: product.product_id
      }).select("price discountPercentage")

      objectProduct.price = productInfo.price
      objectProduct.discountPercentage = productInfo.discountPercentage

      products.push(objectProduct)
    }
    
    const orderInfo = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products
    }

    const order = new Order(orderInfo)
    await order.save()

    await Cart.updateOne({_id: cartId}, {
      products: []
    })

    req.flash("success", "Order placed successfully")
    res.redirect(`/checkout/success/${order.id}`)
      
  } catch (error) {
      console.log(error)
      req.flash("error", "please check the infomation")
      res.redirect("checkout")
  }
  
}

//[GET] /success/:orderId
module.exports.success = async (req, res) => {
  try {
    const order = await Order.findOne({_id: req.params.id})
    for( const product of order.products){
      const productInfo = await Product.findOne({
        _id: product.product_id
      }).select("title thumbnail")
      product.productInfo = productInfo
      product.priceNew = newPriceHelper.newPriceProduct(product)

      product.totalPrice = Number((product.priceNew * product.quantity).toFixed(2))
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)
    res.render("client/pages/checkout/success",{
      title: "Successfull Order",
      order: order
    })
  } catch (error) {
      console.log(error)
      res.redirect("/products")
  }
  
}