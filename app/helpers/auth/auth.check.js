const ensureAuthenticated = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  return next();
};

const isModerator = function (req, res, next) {
  if (req.isAuthenticated()) {
    if (!req.user.isModerator) {
      return res.send({
        success: false,
        message: 'কাজটি করার অনুমতি আপনার নেই!',
      });
    }
    return next();
  }
  return res.redirect('/auth/login');
};

const isAdmin = function (req, res, next) {
  if (req.isAuthenticated()) {
    if (!req.user.isAdmin) {
      return res.send({
        success: false,
        message: 'কাজটি করার অনুমতি আপনার নেই!',
      });
    }
    return next();
  }
  return res.redirect('/auth/login');
};

module.exports = {
  ensureAuthenticated,
  isModerator,
  isAdmin,
};
