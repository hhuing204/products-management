const ProductCategory = require("../../models/product-category.model")
const Products = require("../../models/product.model")
const Accounts = require("../../models/account.model")
const User = require("../../models/user.model")


//Get

module.exports.dashboard = async (req, res) => {
    const statistic = {
      categoryProduct: {
        total: 0,
        active: 0,
        inactive: 0
      },
      product: {
        total: 0,
        active: 0,
        inactive: 0
      },
      account: {
        total: 0,
        active: 0,
        inactive: 0
      },
      user: {
        total: 0,
        active: 0,
        inactive: 0
      }
    }

    //product category
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
      deleted: false
    })
    statistic.categoryProduct.active = await ProductCategory.countDocuments({
      deleted: false,
      status:"active"
    })
    statistic.categoryProduct.inactive= await ProductCategory.countDocuments({
      deleted: false,
      status: "inactive"
    })

    //product
    statistic.product.total = await Products.countDocuments({
      deleted: false
    })
    statistic.product.active = await Products.countDocuments({
      deleted: false,
      status:"active"
    })
    statistic.product.inactive= await Products.countDocuments({
      deleted: false,
      status: "inactive"
    })

    //account
    statistic.account.total = await Accounts.countDocuments({
      deleted: false
    })
    statistic.account.active = await Accounts.countDocuments({
      deleted: false,
      status:"active"
    })
    statistic.account.inactive= await Accounts.countDocuments({
      deleted: false,
      status: "inactive"
    })

    //user
    statistic.user.total = await User.countDocuments({
      deleted: false
    })
    statistic.user.active = await User.countDocuments({
      deleted: false,
      status:"active"
    })
    statistic.user.inactive= await User.countDocuments({
      deleted: false,
      status: "inactive"
    })


    res.render('admin/pages/dashboard/index', { title: 'Dashboard', message: 'Welcome to Dashboard', statistic: statistic })
    // res.send("Welcome to Dashboard page")
  }