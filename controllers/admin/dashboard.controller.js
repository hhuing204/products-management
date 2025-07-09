//Get

module.exports.dashboard = (req, res) => {
    res.render('admin/pages/dashboard/index', { title: 'Dashboard', message: 'Welcome to Dashboard' })
    // res.send("Welcome to Dashboard page")
  }