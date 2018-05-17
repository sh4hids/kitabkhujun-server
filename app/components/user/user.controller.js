const User = require('./user.model');

const createUser = function (req, res, next) {
  res.send({
    success: true,
    message: 'User created successfully',
    data: req.body,
  });
};

const updateUser = function (req, res, next) {
  res.send({
    success: true,
    message: 'User updated successfully',
    data: req.body,
  });
};

const getUserById = function (req, res, next) {
  res.send({
    success: true,
    message: 'User found!',
    data: req.body,
  });
};

const getAllUser = function (req, res, next) {
  const perPage = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';

  User.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({ [sortBy]: sort })
    .select('name username githubId facebookId googleId isAdmin isModerator')
    .then((users) => {
      res.send({
        success: true,
        data: users,
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

const deleteUser = function (req, res, next) {
  res.send({
    success: true,
    message: 'User deleted successfully',
    data: req.body,
  });
};


module.exports = {
  createUser,
  updateUser,
  getUserById,
  getAllUser,
  deleteUser,
};
