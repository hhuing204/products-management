const productRouter = require("./product.route")
const searchRoute= require("./search.route")
const cartRoute= require("./cart.route")
const checkoutRoute= require("./checkout.route")
const homeRoute = require("./home.route")
const userRoute = require("./user.route")
const chatRoute = require("./chat.route")

//Middleware
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")


  module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    app.use(settingMiddleware.settingGeneral)
    app.use('/', homeRoute)
    app.use('/products', productRouter)
    app.use('/search', searchRoute)
    app.use('/cart', cartRoute)
    app.use('/checkout', checkoutRoute)
    app.use('/user', userRoute)
    app.use('/chat', chatRoute)
  }