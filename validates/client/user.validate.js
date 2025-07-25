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

// module.exports.editPatch = (req, res, next) => {
//     if(!req.body.fullName || !req.body.email) {
//         req.flash("error", "Please inform the right form")
//         const backURL = req.get('referer') || '/admin/accounts';
//         res.redirect(backURL)
//         return
//     }
//     next()
// }
