//other
const md5 = require("md5")
//helper
const generateHelper = require("../../helpers/generate")
const sendMailHelpper = require("../../helpers/sendMail")
//collection
const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")


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
        await User.updateOne({
            tokenUser: user.tokenUser
        },{
            statusOnline: "online"
        })

        const cartId = req.cookies.cartId


        const cartIdByUser = await Cart.findOne({user_id: user.id})
        if(cartIdByUser){
            res.cookie("cartIdNoUser", cartId)
            res.cookie("cartId", cartIdByUser)
        } else {
            await Cart.updateOne({
                _id: req.cookies.cartId,
            },{
                user_id: user.id
            })
        }

        _io.once('connection', (socket) => {
            socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
                userId: user.id,
                status: "online"
            })
        })

        
        req.flash("success", "Login successfully!!")
        res.redirect("/")

        
    } catch (error) {
        console.log(error)
        req.flash("error", "please check your infor in fields")
        res.redirect("/user/login")
    }
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    },{
        statusOnline: "offline"
    })

    
    const cartIdNoUser = req.cookies.cartIdNoUser
    res.cookie("cartId", cartIdNoUser)
    res.clearCookie("tokenUser")
    res.clearCookie("cartIdNoUser")
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: res.locals.user.id,
            status: "offline"
        })
    })
    req.flash("success", "Logout Successfully")
    res.redirect("/")
}


// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        title: "Forgot Password"
    })
}


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const email = req.body.email

        const user = await User.findOne({
            email: email,
            deleted: false
        })

        if(!user) {
            req.flash("error", "This Email hasn't existed yet!")
            res.redirect("/user/login")
            return
        }
        //save info into db
        const otp = generateHelper.generateRandomNumber(8)

        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }

        const forgotPassword = new ForgotPassword(objectForgotPassword)
        await forgotPassword.save()

        //send OTP here
        const subject = "[OTP CODE] RECOVER PASSWORD"
        const html = `
            OTP code to recover password is <b>${otp} </b>. Time expires is 60 seconds
        `
        sendMailHelpper.sendMail(email, subject, html)

        res.redirect(`/user/password/otp?email=${email}`)
    } catch (error) {
        console.log(error)
        req.flash("error", "please check your infor in fields")
        res.redirect("/user/password/forgot")
    }
}

// [GET] /user/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/user/otp", {
        title: "Fill in OTP fields",
        email: email
    })
}

// [POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email
    try {
        const otp = req.body.otp

        const result = await ForgotPassword.findOne({
            email: email,
            otp: otp
        })

        if(!result) {
            req.flash("error", "Wrong OTP!")
            res.redirect(`/user/password/otp?email=${email}`)
            return
        }

        const user = await User.findOne({
            email: email
        })

        res.cookie("tokenUser", user.tokenUser)
        res.redirect("/user/password/resetPassword")

        res.send("OK")
    } catch (error) {
        console.log(error)
        req.flash("error", "please check your infor in fields")
        res.redirect(`/user/password/otp?email=${email}`)
    }
}

// [GET] /user/password/resetPassword
module.exports.resetPassword = async (req, res) => {

    res.render("client/pages/user/resetPassword", {

        title: "Reset Password"
    })
}

// [POST] /user/password/resetPassword
module.exports.resetPasswordPost = async (req, res) => {
    
    try {
        const password = req.body.password
        const tokenUser = req.cookies.tokenUser

        await User.updateOne({
            tokenUser: tokenUser
        }, {
            password: md5(password)
        })

        req.flash("success", "Password has been recovered successfully!!")
        res.redirect("/")
        
    } catch (error) {
        console.log(error)
        req.flash("error", "please check your infor in fields")
        res.redirect("/user/password/resetPassword")
    }
}

// [GET] /user/info
module.exports.info = async (req, res) => {

    res.render("client/pages/user/info", {
        title: "User Information",
    })
}