const path = require('path');

const logIn = function (req, res, next) {
  res.render(path.join(__dirname, 'login'));
};

const logOut = function (req, res, next) {
  res.send('Logged out.');
};

const googleCallbackHandler = function (req, res, next) {
  req.login(req.user, () => {
    res.redirect('/api/v1/docs');
  });
};

const facebookCallbackHandler = function (req, res, next) {
  res.send('Logged in with facebook');
};

const githubCallbackHandler = function (req, res, next) {
  req.login(req.user, () => {
    res.redirect('/api/v1/docs');
  });
};

module.exports = {
  logIn,
  logOut,
  googleCallbackHandler,
  facebookCallbackHandler,
  githubCallbackHandler,
};
