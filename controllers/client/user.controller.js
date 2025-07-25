const md5 = require("md5")
const User = require("../../models/user.model")

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        title: "Register"
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const existEmail = await User.findOne({
            email: req.body.email
        })
        if(existEmail) {
            req.flash("error", "This email has already existed!")
            res.redirect("/user/register")
            return
        }

        req.body.password = md5(req.body.password)
        const user = new User(req.body)
        await user.save()

        res.cookie("tokenUser", user.tokenUser)

        req.flash("success", "Your account is created successfully!!")
        res.redirect("/")
        
    } catch (error) {
        console.log(error)
        req.flash("error", "please check your infor in fields")
        res.redirect("/user/register")
    }
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        title: "Login"
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({
            email: email,
            deleted:false
        })

        if(!user) {
            req.flash("error", "This Email hasn't existed yet!")
            res.redirect("/user/login")
            return
        }
        if(md5(password) !== user.password){
            req.flash("error", "Wrong password")
            res.redirect("/user/login")
            return
        }

        if(user.active === "inactive") {
            req.flash("error", "This account has been blocked!")
            res.redirect("/user/login")
            return
        }

        res.cookie("tokenUser", user.tokenUser)
        req.flash("success", "Login successfully!!")
        res.redirect("/")

        
    } catch (error) {
        console.log(error)
        req.flash("error", "please check your infor in fields")
        res.redirect("/user/login")
    }
}