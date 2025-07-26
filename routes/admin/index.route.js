const authMiddleware = require("../../middlewares/admin/auth.middleware")

const dashboardRouter = require("./dashboard.route")
const productRouter = require("./product.route")
const systemConfig = require("../../config/system")
const productCategoryRouter = require("./product-category.route")
const rolesRouter = require("./role.route")
const accountRouter = require("./account.route")
const authRouter = require("./auth.route")
const myAccountRouter = require("./myAccount.route")
const settingRouter = require("./setting.route")

  module.exports = (app) => {
    app.use(
      systemConfig.prefixAdmin + '/dashboard',
      authMiddleware.requireAuth, 
      dashboardRouter)
    app.use(systemConfig.prefixAdmin + '/products', authMiddleware.requireAuth, productRouter)
    app.use(systemConfig.prefixAdmin + '/products-category', authMiddleware.requireAuth, productCategoryRouter)
    app.use(systemConfig.prefixAdmin + '/roles', authMiddleware.requireAuth, rolesRouter)
    app.use(systemConfig.prefixAdmin + '/accounts', authMiddleware.requireAuth, accountRouter)
    app.use(systemConfig.prefixAdmin + '/auth', authRouter)
    app.use(systemConfig.prefixAdmin + '/my-account', authMiddleware.requireAuth, myAccountRouter)
    app.use(systemConfig.prefixAdmin + '/settings', authMiddleware.requireAuth, settingRouter)
  }