module.exports.loginPost = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        req.flash("error", "Please inform the right form")
        const backURL = req.get('referer') || '/admin/auth/login';
        res.redirect(backURL)
        return
    }
    next()
}