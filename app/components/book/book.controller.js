const Book = require('./book.model');

const createBook = function (req, res, next) {
  if (!req.body.title) {
    res.status(400).send({
      success: false,
      message: 'অগ্রহণযোগ্য শিরোনাম!',
    });
  } else {
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      description: req.body.description,
      category: req.body.category,
      availableSources: req.body.availableSources,
      downloadLinks: req.body.downloadLinks,
      addedBy: req.user.id,
      createdAt: req.body.createdAt,
    };

    Book.findOrCreate({ title: newBook.title }, newBook)
      .then((book) => {
        if (!book.created) {
          res.send({
            success: false,
            message: 'একই নামে লেখক আগে থেকেই ছিলো।',
          });
        } else {
          Book.findById(book.doc.id)
            .select('title description availableSources downloadLinks')
            .populate('author', 'name')
            .populate('publisher', 'title')
            .populate('category', 'title')
            .then((addedBook) => {
              res.send({
                success: true,
                message: 'নতুন লেখক যোগ করা হয়েছে!',
                data: addedBook,
              });
            });
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send({
            success: false,
            message: 'কিছু একটা ঠিক নেই!',
          });
        }
      });
  }
};

const updateBook = function (req, res, next) {
  if (!req.body.title || !req.params.id) {
    res.status(400).send({
      success: false,
      message: req.params.id ? 'অগ্রহণযোগ্য শিরোনাম!' : 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    const updatedBook = {
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      description: req.body.description,
      category: req.body.category,
      availableSources: req.body.availableSources,
      downloadLinks: req.body.downloadLinks,
      updatedBy: req.user.id,
      updatedAt: req.body.updatedAt || new Date(),
    };
    Book.findByIdAndUpdate(req.params.id, updatedBook)
      .then((book) => {
        Book.findById(book.id)
          .select('title description availableSources downloadLinks')
          .populate('author', 'name')
          .populate('publisher', 'title')
          .populate('category', 'title')
          .then((updatedBookData) => {
            res.send({
              success: true,
              message: 'বিষয়ের তথ্য নবায়ণ সফল হয়েছে।',
              data: updatedBookData,
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

const getBookById = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    Book.findById(req.params.id)
      .select('title description availableSources downloadLinks')
      .populate('author', 'name')
      .populate('publisher', 'title')
      .populate('category', 'title')
      .then((book) => {
        if (book) {
          res.send({
            success: true,
            data: book,
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'খুঁজে পাওয়া যায়নি।',
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

const getAllBook = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Book.find({})
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
    })
    .catch((err) => {
      if (err) {
        res.status(400).send({
          success: false,
          message: 'কিছু একটা ঠিক নেই!',
        });
      }
    });
};

const findBookByTitle = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Book.find({
    title: {
      $regex: req.query.title,
      $options: 'i',
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
    })
    .catch((err) => {
      if (err) {
        res.status(400).send({
          success: false,
          message: 'কিছু একটা ঠিক নেই!',
        });
      }
    });
};

const deleteBook = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি সঠিক নয়।',
    });
  } else {
    Book.findOneAndRemove({ _id: req.params.id })
      .select('title description')
      .then((book) => {
        if (book) {
          res.send({
            success: true,
            data: book,
            message: 'ডিলিট সফল হয়েছে।',
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'খুঁজে পাওয়া যায়নি।',
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
  createBook,
  updateBook,
  getBookById,
  getAllBook,
  findBookByTitle,
  deleteBook,
};
