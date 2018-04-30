const Book = require('./book.model');
const bookController = require('./book.controller');
const bookRouter = require('./book.route');

module.exports = {
  Book,
  bookController,
  bookRouter,
};
