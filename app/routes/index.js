const config = require('../config/config');
const { authRouter } = require('../helpers/auth');
const { docsRouter } = require('../components/docs');
const { userRouter } = require('../components/user');
const { authorRouter } = require('../components/author');
const { bookRouter } = require('../components/book');
const { categoryRouter } = require('../components/category');
const { publisherRouter } = require('../components/publisher');

const init = function (app) {
  app.use('/auth', authRouter);
  app.use(`/${config.api}/docs`, docsRouter);
  app.use(`/${config.api}/users`, userRouter);
  app.use(`/${config.api}/authors`, authorRouter);
  app.use(`/${config.api}/books`, bookRouter);
  app.use(`/${config.api}/categories`, categoryRouter);
  app.use(`/${config.api}/publishers`, publisherRouter);
};

module.exports = {
  init,
};
