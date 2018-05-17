const express = require('express');
const userController = require('./user.controller');
const { authCheck: { ensureAuthenticated, isAdmin } } = require('../../helpers/auth');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', isAdmin, userController.getAllUser);
router.get('/:id', ensureAuthenticated, userController.getUserById);
router.put('/:id', ensureAuthenticated, userController.updateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router;
