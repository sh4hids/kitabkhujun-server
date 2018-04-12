const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
