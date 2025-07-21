const Accounts = require("../../models/account.model")
const Role = require("../../models/role.model")
const md5 = require("md5")
const systemConfig = require("../../config/system")

//Get

module.exports.index= async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Accounts.find(find).select("-password -token")

  for (const record of records) {
    const role = await Role.findOne({
        deleted: false,
        _id: record.role_id
    })
    record.role = role
  }

  res.render('admin/pages/accounts/index', { 
    title: 'Accounts management', 
    records: records
  })
}

//[GET] admin/accounts/create
module.exports.create= async (req, res) => {
    let find = {
      deleted: false
    }
  
    const records = await Role.find(find)


  
    res.render('admin/pages/accounts/create', { 
      title: 'Create an account', 
      records: records
    })
  }

//[POST] /admin/roles/create
module.exports.createPost= async (req, res) => {
    const emailExist = await Accounts.findOne({
        email: req.body.email,
        deleted: false
    })

    if (emailExist){
        req.flash("error", `This email has already existed!`)
        res.redirect(`${systemConfig.prefixAdmin}/accounts/create`)
    } else {
        req.body.password = md5(req.body.password)
        const record = new Accounts(req.body)
        await record.save()
    
        req.flash("success", `This Account has already been created!`)
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    } 
  }

//[GET] admin/account/edit/:id
module.exports.edit = async (req, res) => {

    try {
      const find = {
        deleted: false,
        _id: req.params.id
      }
    
      const data = await Accounts.findOne(find)
  
      const roles = await Role.find({
        deleted: false
      });
      
      
      res.render("admin/pages/accounts/edit", {
        title: "Edit an account",
        data: data,
        roles: roles
      })
    } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/accounts`)
      req.flash("error", `This account does not exist`)
    }
  }

//[PATCH] /admin/roles/edit
module.exports.editPatch= async (req, res) => {

  const emailExist = await Accounts.findOne({
      _id: {$ne: req.params.id},
      email: req.body.email,
      deleted: false
  })

  if (emailExist){
      req.flash("error", `Email ${req.body.email} has already existed!`)
      res.redirect(`${systemConfig.prefixAdmin}/accounts/create`)
  } else {
      if(req.body.password) {
          req.body.password = md5(req.body.password)
      } else {
          delete req.body.password
      }
  
      await Accounts.updateOne({
          _id: req.params.id
      }, req.body)
      req.flash("success", `This Account has already been edited!`)
      res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
} 