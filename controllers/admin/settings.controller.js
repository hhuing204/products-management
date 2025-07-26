const systemConfig = require("../../config/system")
const SettingGeneral = require("../../models/setting-general.model")
// [GET] /settings/general

module.exports.general= async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})
    
  
    res.render('admin/pages/setting/general', { 
      title: 'General Settings',
      settingGeneral: settingGeneral
    })
  }

  
// [PATCH] /settings/general

module.exports.generalPatch= async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({})
        if(settingGeneral){
            await SettingGeneral.updateOne({_id: settingGeneral.id},req.body)
        } else {
            const record = new SettingGeneral(req.body)
            await record.save()
        }

        req.flash("success", `This information has already been edited!`)
        res.redirect(`${systemConfig.prefixAdmin}/settings/general`)
    } catch (error) {
        console.log(error)
        req.flash("error", `This information hasn't already been edited yet!`)
        res.redirect(`${systemConfig.prefixAdmin}/settings/general`)
    }

}