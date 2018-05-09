const Author = require('./author.model');
const Book = require('../book/book.model');

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
      addedBy: req.user.id,
      authorInfo: req.body.info,
      authorPhoto: req.body.photo,
    };

    Author.findOrCreate({ name: newAuthor.name }, newAuthor)
      .then((author) => {
        res.send({
          success: author.created,
          message: author.created ? 'নতুন লেখক যোগ করা হয়েছে!' : 'একই নামে লেখক আগে থেকেই ছিলো।',
          data: {
            name: author.doc.name,
            authorInfo: author.doc.authorInfo,
            authorPhoto: author.doc.authorPhoto,
            updatedAt: author.doc.updatedAt,
          },
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: 'Something went wrong!',
          data: err,
        });
      });
  }
};

const updateAuthor = function (req, res, next) {
  if (!req.body.name || !req.params.id) {
    res.status(400).send({
      success: false,
      message: 'লেখকের নাম অগ্রহণযোগ্য!',
    });
  } else {
    const updatedAuthor = {
      name: req.body.name,
      authorInfo: req.body.info,
      authorPhoto: req.body.photo,
      updatedBy: req.user.id,
      updatedAt: req.body.updatedAt || new Date(),
    };
    Author.findByIdAndUpdate(req.params.id, updatedAuthor)
      .then((author) => {
        Author.findById(author.id)
          .select('name authorInfo authorPhoto updatedAt')
          .then((updatedAuthorData) => {
            res.send({
              success: true,
              message: 'লেখকের তথ্য নবায়ণ সফল হয়েছে।',
              data: updatedAuthorData,
            });
          });
      })
      .catch((err) => {
        if (err) {
          res.status(400).send({
            success: false,
            message: 'সরবরাহকৃত আইডিটি সঠিক নয়।',
          });
        }
      });
  }
};

const getAuthorById = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'লেখকের আইডি সঠিক নয়।',
    });
  } else {
    Author.findById(req.params.id)
      .select('name authorInfo authorPhoto updatedAt')
      .then((author) => {
        if (author) {
          res.send({
            success: true,
            data: author,
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'লেখক খুঁজে পাওয়া যায়নি।',
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: 'Something went wrong!',
          error: err,
        });
      });
  }
};

const getBookByAuthor = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'লেখকের আইডি সঠিক নয়।',
    });
  } else {
    Author.findById(req.params.id)
      .select('name authorInfo authorPhoto')
      .then((author) => {
        if (author) {
          const perPage = Number(req.query.limit) || 0;
          const page = Number(req.query.page) || 1;
          const sort = req.query.sort || 'asc';
          const sortBy = req.query.sortBy || 'createdAt';

          Book.find({
            author: {
              _id: author.id,
            },
          })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ [sortBy]: sort })
            .select('title description availableSources downloadLinks')
            .populate('author', 'name')
            .populate('publisher', 'title')
            .populate('category', 'title')
            .then((books) => {
              res.send({
                success: true,
                data: books,
              });
            });
        } else {
          res.status(404).send({
            success: false,
            message: 'লেখক খুঁজে পাওয়া যায়নি।',
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: 'Something went wrong!',
          error: err,
        });
      });
  }
};

const getAllAuthor = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Author.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('name authorInfo authorPhoto updatedAt')
    .populate('addedBy', 'name')
    .then((authors) => {
      res.send({
        success: true,
        data: authors,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: 'Something went wrong!',
        data: err,
      });
    });
};

const findAuthorByName = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Author.find({
    name: {
      $regex: req.query.name,
      $options: 'i',
    },
  })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('name authorInfo authorPhoto updatedAt')
    .then((authors) => {
      res.send({
        success: true,
        data: authors,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: false,
        message: 'Something went wrong!',
        data: err,
      });
    });
};

const deleteAuthor = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'লেখকের আইডি সঠিক নয়।',
    });
  } else {
    Author.findOneAndRemove({ _id: req.params.id })
      .select('name authorInfo authorPhoto updatedAt')
      .then((author) => {
        if (author) {
          res.send({
            success: true,
            data: author,
            message: 'লেখক ডিলিট সফল হয়েছে।',
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'লেখক খুঁজে পাওয়া যায়নি।',
          });
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send({
            success: false,
            message: 'সরবরাহকৃত আইডিটি সঠিক নয়।',
          });
        }
      });
  }
};


module.exports = {
  createAuthor,
  updateAuthor,
  getAuthorById,
  getBookByAuthor,
  getAllAuthor,
  findAuthorByName,
  deleteAuthor,
};
