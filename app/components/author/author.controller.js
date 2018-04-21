const Author = require('./author.model');

const createAuthor = function (req, res, next) {
  if (!req.body.name) {
    res.status(400).send({
      success: false,
      message: 'লেখকের নাম অগ্রহণযোগ্য!',
    });
  } else {
    const newAuthor = {
      name: req.body.name,
      createdAt: req.body.createdAt,
    };

    Author.findOrCreate({ name: newAuthor.name }, newAuthor).then((author) => {
      res.send({
        success: true,
        message: 'Author created successfully',
        data: author,
      });
    }).catch((err) => {
      res.status(400).send({
        success: false,
        message: 'Something went wrong!',
        data: err,
      });
    });
  }
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
  Author.find({}).then((authors) => {
    res.send({
      success: true,
      message: 'All Author in DB',
      data: authors,
    });
  }).catch((err) => {
    res.status(400).send({
      success: false,
      message: 'Something went wrong!',
      data: err,
    });
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