const config = require('../config/config');
const { authRouter } = require('../helpers/auth');
const { userRouter } = require('../components/user');
const { authorRouter } = require('../components/author');

const init = function (app) {
  app.use('/auth', authRouter);
  app.use(`/${config.api}/users`, userRouter);
  app.use(`/${config.api}/authors`, authorRouter);
};

module.exports = {
  init,
};
