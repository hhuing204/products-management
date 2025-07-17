const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")

//Get

module.exports.index= async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)

  res.render('admin/pages/role/index', { 
    title: 'Roles', 
    records: records
  })
}
//[GET] /admin/roles/create
module.exports.create= async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)

  res.render('admin/pages/role/create', { 
    title: 'Create a permission',
    records: records
  })
}


//[POST] /admin/roles/create
module.exports.createPost= async (req, res) => {
  const record = new Role(req.body)
  await record.save()

  req.flash("success", `This permission has already been created!`)
  res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

//[GET] /admin/roles/edit
module.exports.edit= async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false
    }

    const data = await Role.findOne(find)
    // console.log(data.title)

    res.render('admin/pages/role/edit', { 
      title: 'Edit Create a permission',
      data: data
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
    req.flash("error", `This permission does not exist`)
  }
}

  //[PATCH] admin/roles/edit/:id
  module.exports.editPatch = async (req, res) => {
    try {
      const id = req.params.id

      await Role.updateOne({
        _id: id
      }, req.body)

      // const record = new Role(req.body)
      // await record.save()

      req.flash("success", `This role has already been edited!`)
      res.redirect(`${systemConfig.prefixAdmin}/roles`)
    } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }


}



//[GET] /admin/roles/permissions
module.exports.permissions= async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Role.find(find)

  res.render('admin/pages/role/permissions', { 
    title: 'Create a permission',
    records: records
  })
}


 //[PATCH] admin/roles/permissions
 module.exports.permissionsPatch = async (req, res) => {
  // console.log(JSON.parse(req.body.permissions))
  try {
    const permissions = JSON.parse(req.body.permissions)

    for (const item of permissions) {
      await Role.updateOne({
        _id: item.id
      },{
        permissions: item.listPermissions
      })
    }
    req.flash("success", `This permission has already been udated!`)
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)
    

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)
  }


}