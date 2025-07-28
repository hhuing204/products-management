const productRouter = require("./product.route")
const searchRoute= require("./search.route")
const cartRoute= require("./cart.route")
const checkoutRoute= require("./checkout.route")
const homeRoute = require("./home.route")
const userRoute = require("./user.route")
const chatRoute = require("./chat.route")
const usersRoute = require("./users.route")

//Middleware
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")
const authMiddleware = require("../../middlewares/client/auth.middleware")


  module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.infoUser)
    // app.use(userMiddleware.connect)
    app.use(settingMiddleware.settingGeneral)
    app.use('/', homeRoute)
    app.use('/products', productRouter)
    app.use('/search', searchRoute)
    app.use('/cart', cartRoute)
    app.use('/checkout', checkoutRoute)
    app.use('/user', userRoute)
    app.use('/chat', authMiddleware.requireAuth, chatRoute)
    app.use('/users', authMiddleware.requireAuth, usersRoute)
  }