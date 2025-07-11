module.exports.createPost = (req, res, next) => {
    if(!req.body.title) {
        req.flash("error", "Please inform the title")
        const backURL = req.get('referer') || '/admin/products';
        res.redirect(backURL)
        return
    }
    next()
}
