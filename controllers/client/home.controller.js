module.exports.index = (req, res) => {
    res.render('client/pages/home/index', { title: 'Homepage', message: 'Welcome Homepage' })
  }