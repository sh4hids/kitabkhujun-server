const Category = require('./category.model');
const Book = require('../book/book.model');

const createCategory = function (req, res, next) {
  if (!req.body.title) {
    res.status(400).send({
      success: false,
      message: 'অগ্রহণযোগ্য শিরোনাম!',
    });
  } else {
    const newCategory = {
      title: req.body.title,
      createdAt: req.body.createdAt,
      addedBy: req.user.id,
      description: req.body.description,
    };

    Category.findOrCreate({ title: newCategory.title }, newCategory)
      .then((category) => {
        res.send({
          success: category.created,
          message: category.created ? 'সফলভাবে যোগ করা হয়েছে!' : 'একই নামে আগে থেকেই ছিলো।',
          data: {
            title: category.doc.title,
            description: category.doc.description,
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

const updateCategory = function (req, res, next) {
  if (!req.body.title || !req.params.id) {
    res.status(400).send({
      success: false,
      message: req.params.id ? 'অগ্রহণযোগ্য শিরোনাম!' : 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    const updatedCategory = {
      title: req.body.title,
      description: req.body.description,
      updatedBy: req.user.id,
      updatedAt: req.body.updatedAt || new Date(),
    };
    Category.findByIdAndUpdate(req.params.id, updatedCategory)
      .then((category) => {
        Category.findById(category.id)
          .select('title description')
          .then((updatedCategoryData) => {
            res.send({
              success: true,
              message: 'তথ্য নবায়ণ সফল হয়েছে।',
              data: updatedCategoryData,
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

const getCategoryById = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    Category.findById(req.params.id)
      .select('title description')
      .then((category) => {
        if (category) {
          res.send({
            success: true,
            data: category,
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

const getBookByCategory = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি শূণ্য হতে পারবে না!',
    });
  } else {
    Category.findById(req.params.id)
      .select('title description')
      .then((category) => {
        if (category) {
          const perPage = Number(req.query.limit) || 0;
          const page = Number(req.query.page) || 1;
          const sort = req.query.sort || 'asc';
          const sortBy = req.query.sortBy || 'createdAt';

          Book.find({
            category: {
              _id: category.id,
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

const getAllCategory = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Category.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('title description')
    .then((categories) => {
      res.send({
        success: true,
        data: categories,
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

const findCategoryByTitle = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  Category.find({
    title: {
      $regex: req.query.title,
      $options: 'i',
    },
  })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('title description')
    .then((categories) => {
      res.send({
        success: true,
        data: categories,
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

const deleteCategory = function (req, res, next) {
  if (!req.params.id) {
    res.status(400).send({
      success: false,
      message: 'আইডি সঠিক নয়।',
    });
  } else {
    Category.findOneAndRemove({ _id: req.params.id })
      .select('title description')
      .then((category) => {
        if (category) {
          res.send({
            success: true,
            data: category,
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
  createCategory,
  updateCategory,
  getCategoryById,
  getBookByCategory,
  getAllCategory,
  findCategoryByTitle,
  deleteCategory,
};
