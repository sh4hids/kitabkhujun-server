// const Author = require('./Author.model');

const createAuthor = function (req, res, next) {
  res.send({
    success: true,
    message: 'Author created successfully',
    data: req.body,
  });
};

const updateAuthor = function (req, res, next) {
  res.send({
    success: true,
    message: 'Author updated successfully',
    data: req.body,
  });
};

const getAuthorById = function (req, res, next) {
  res.send({
    success: true,
    message: 'Author found!',
    data: req.body,
  });
};

const getAllAuthor = function (req, res, next) {
  res.send({
    success: true,
    message: 'All Author in DB',
    data: req.body,
  });
};

const deleteAuthor = function (req, res, next) {
  res.send({
    success: true,
    message: 'Author deleted successfully',
    data: req.body,
  });
};


module.exports = {
  createAuthor,
  updateAuthor,
  getAuthorById,
  getAllAuthor,
  deleteAuthor,
};
