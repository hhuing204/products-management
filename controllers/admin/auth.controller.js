const systemConfig = require("../../config/system")
const md5 = require("md5")
const Accounts = require("../../models/account.model")

//Get
module.exports.login = (req, res) => {
    if(req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
        return
    }
    res.render('admin/pages/auth/login', { title: 'Authentication', message: 'Welcome to Admin product Management' })
    // res.send("Welcome to Dashboard page")
  }

//POST

module.exports.loginPost = async (req, res) => {
    
    const {email, password} = req.body
    
    const user = await Accounts.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash("error", `This Email doesn't exist !`)
        const backURL = req.get('referer') || '/admin/auth/login';
        res.redirect(backURL)
        return
    }
    if(md5(password) != user.password) {
        req.flash("error", `Wrong Password !`)
        const backURL = req.get('referer') || '/admin/auth/login';
        res.redirect(backURL)
        return
    }
    if(user.status == "inactive") {
        req.flash("error", `This account is blocked!`)
        const backURL = req.get('referer') || '/admin/auth/login';
        res.redirect(backURL)
        return
    }

    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)

}

module.exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  }