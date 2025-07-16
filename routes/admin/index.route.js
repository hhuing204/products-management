const dashboardRouter = require("./dashboard.route")
const productRouter = require("./product.route")
const systemConfig = require("../../config/system")
const productCategoryRouter = require("./product-category.route")
const rolesRouter = require("./role.route")


  module.exports = (app) => {
    app.get(systemConfig.prefixAdmin + '/dashboard', dashboardRouter)
    app.use(systemConfig.prefixAdmin + '/products', productRouter)
    app.use(systemConfig.prefixAdmin + '/products-category', productCategoryRouter)
    app.use(systemConfig.prefixAdmin + '/roles', rolesRouter)
  }