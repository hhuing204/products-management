const systemConfig = require("../../config/system")
const Accounts = require("../../models/account.model")
//Get

module.exports.index = (req, res) => {
    res.render('admin/pages/myAccount/index', { title: 'My Account' })
    // res.send("Welcome to Dashboard page")
  }


  module.exports.edit = (req, res) => {
    res.render('admin/pages/myAccount/edit', { title: 'Edit My Account' })
    // res.send("Welcome to Dashboard page")
  }

//[PATCH] /my-account/edit
module.exports.editPatch= async (req, res) => {

  const emailExist = await Accounts.findOne({
      _id: {$ne: res.locals.user.id},
      email: res.locals.user.email,
      deleted: false
  })

  if (emailExist){
      req.flash("error", `Email ${res.locals.user.email} has already existed!`)
      res.redirect(`${systemConfig.prefixAdmin}/accounts/create`)
  } else {
      if(req.body.password) {
          req.body.password = md5(req.body.password)
      } else {
          delete req.body.password
      }
  
      await Accounts.updateOne({
          _id: res.locals.user.id
      }, req.body)
      req.flash("success", `Your information has already been edited!`)
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  }
} 