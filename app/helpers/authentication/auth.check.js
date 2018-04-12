const isAuthenticated = function (req, res, next) {
  if (req.user) {
    res.redirect('/auth/login');
  }
  return next();
};

module.exports = isAuthenticated;
