const Category = require('./category.model');

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
      categoryDescription: req.body.description,
    };

    Category.findOrCreate({ title: newCategory.title }, newCategory)
      .then((category) => {
        res.send({
          success: category.created,
          message: category.created ? 'নতুন লেখক যোগ করা হয়েছে!' : 'একই নামে লেখক আগে থেকেই ছিলো।',
          data: {
            title: category.doc.title,
            categoryDescription: category.doc.categoryDescription,
            updatedAt: category.doc.updatedAt,
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
      categoryDescription: req.body.description,
      updatedBy: req.user.id,
      updatedAt: req.body.updatedAt || new Date(),
    };
    Category.findByIdAndUpdate(req.params.id, updatedCategory)
      .then((category) => {
        Category.findById(category.id)
          .select('title categoryDescription updatedAt')
          .then((updatedCategoryData) => {
            res.send({
              success: true,
              message: 'বিষয়ের তথ্য নবায়ণ সফল হয়েছে।',
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
      .select('title categoryDescription updatedAt')
      .then((category) => {
        if (category) {
          res.send({
            success: true,
            data: category,
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'বিষয়টি খুঁজে পাওয়া যায়নি।',
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
    .select('title categoryDescription updatedAt')
    .populate('addedBy', 'name')
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
    .select('title categoryDescription updatedAt')
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
      .select('title categoryDescription updatedAt')
      .then((category) => {
        if (category) {
          res.send({
            success: true,
            data: category,
            message: 'বিষয় ডিলিট সফল হয়েছে।',
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'বিষয়টি খুঁজে পাওয়া যায়নি।',
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
  getAllCategory,
  findCategoryByTitle,
  deleteCategory,
};
