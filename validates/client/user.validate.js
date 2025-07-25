module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullName || !req.body.email || !req.body.password) {
        req.flash("error", "Please inform the right form")
        const backURL = req.get('referer') || '/user/register';
        res.redirect(backURL)
        return
    }
    next()
}

module.exports.loginPost = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        req.flash("error", "Please inform the right form")
        const backURL = req.get('referer') || '/user/login';
        res.redirect(backURL)
        return
    }
    next()
}

module.exports.forgotPasswordPost = (req, res, next) => {
    if(!req.body.email) {
        req.flash("error", "Please inform the right form")
        const backURL = req.get('referer') || '/user/password/forgot';
        res.redirect(backURL)
        return
    }
    next()
}


module.exports.resetPasswordPost = (req, res, next) => {
    if(!req.body.password || !req.body.confirmPassword) {
        req.flash("error", "Please inform the right form")
        const backURL = req.get('referer') || '/user/password/resetPassword';
        res.redirect(backURL)
        return
    }
    // console.log(req.body.password)
    // console.log(req.body.confirmPassword)
    if(req.body.password != req.body.confirmPassword) {
        req.flash("error", "Please check confirm Password !")
        const backURL = req.get('referer') || '/user/password/resetPassword';
        res.redirect(backURL)
        return
    }
    
    next()
}

// module.exports.editPatch = (req, res, next) => {
//     if(!req.body.fullName || !req.body.email) {
//         req.flash("error", "Please inform the right form")
//         const backURL = req.get('referer') || '/admin/accounts';
//         res.redirect(backURL)
//         return
//     }
//     next()
// }
