const config = require('../config/config');
const { userRouter } = require('../components/user');
const { authRouter } = require('../helpers/auth');

const init = function (app) {
  app.use('/auth', authRouter);
  app.use(`/${config.api}/users`, userRouter);
};

module.exports = {
  init,
};
