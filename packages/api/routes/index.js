exports.index = function(req, res){
  // res.render('index', { title: 'Express', user: req.user });
  res.redirect('/dashboard/');
};