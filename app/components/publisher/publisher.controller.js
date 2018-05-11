const Publisher = require('./publisher.model');
const Book = require('../book/book.model');

const createPublisher = function (req, res, next) {
  if (!req.body.title) {
    res.status(400).send({
      success: false,
      message: 'অগ্রহণযোগ্য শিরোনাম!',
    });
  } else {
    const newPublisher = {
      title: req.body.title,
      createdAt: req.body.createdAt,
      addedBy: req.user.id,
      publisherInfo: req.body.info,
    };

    Publisher.findOrCreate({ title: newPublisher.title }, newPublisher)
      .then((publisher) => {
        res.send({
          success: publisher.created,
          message: publisher.created ? 'নতুন প্রকাশক যোগ করা হয়েছে!' : 'একই নামে প্রকাশক আগে থেকেই ছিলো।',
          data: {
            title: publisher.doc.title,
            publisherInfo: publisher.doc.categoryDescription,
            updatedAt: publisher.doc.updatedAt,
          },
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
  }
};

const updatePublisher = function (req, res, next) {
  if (!req.body.title || !req.params.id) {
    res.status(400).send({
      success: false,
      message: req.params.id ? 'অগ্রহণযোগ্য শিরোনাম!' : 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    const updatedPublisher = {
      title: req.body.title,
      publisherInfo: req.body.info,
      updatedBy: req.user.id,
      updatedAt: req.body.updatedAt || new Date(),
    };
    Publisher.findByIdAndUpdate(req.params.id, updatedPublisher)
      .then((publisher) => {
        Publisher.findById(publisher.id)
          .select('title publisherInfo updatedAt')
          .then((updatedPublisherData) => {
            res.send({
              success: true,
              message: 'তথ্য নবায়ণ সফল হয়েছে।',
              data: updatedPublisherData,
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

const getPublisherById = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    Publisher.findById(req.params.id)
      .select('title publisherInfo updatedAt')
      .then((publisher) => {
        if (publisher) {
          res.send({
            success: true,
            data: publisher,
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'প্রকাশক খুঁজে পাওয়া যায়নি।',
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

const getBookByPublisher = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    Publisher.findById(req.params.id)
      .select('title publisherInfo')
      .then((publisher) => {
        if (publisher) {
          const perPage = Number(req.query.limit) || 0;
          const page = Number(req.query.page) || 1;
          const sort = req.query.sort || 'asc';
          const sortBy = req.query.sortBy || 'createdAt';

          Book.find({
            publisher: {
              _id: publisher.id,
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

const getAllPublisher = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Publisher.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('title publisherInfo updatedAt')
    .populate('addedBy', 'name')
    .then((publishers) => {
      res.send({
        success: true,
        data: publishers,
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

const findPublisherByTitle = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Publisher.find({
    title: {
      $regex: req.query.title,
      $options: 'i',
    },
  })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('title publisherInfo updatedAt')
    .then((publishers) => {
      res.send({
        success: true,
        data: publishers,
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

const deletePublisher = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি সঠিক নয়।',
    });
  } else {
    Publisher.findOneAndRemove({ _id: req.params.id })
      .select('title publisherInfo updatedAt')
      .then((publisher) => {
        if (publisher) {
          res.send({
            success: true,
            data: publisher,
            message: 'প্রকাশক ডিলিট সফল হয়েছে।',
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'প্রকাশক খুঁজে পাওয়া যায়নি।',
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
  createPublisher,
  updatePublisher,
  getPublisherById,
  getBookByPublisher,
  getAllPublisher,
  findPublisherByTitle,
  deletePublisher,
};
