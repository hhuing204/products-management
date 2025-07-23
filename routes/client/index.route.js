const productRouter = require("./product.route")
const searchRoute= require("./search.route")
const cartRoute= require("./cart.route")
const homeRoute = require("./home.route")
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")

  module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.get('/', homeRoute)
    app.use('/products', productRouter)
    app.use('/search', searchRoute)
    app.use('/cart', cartRoute)
  }