const express = require('express');
const { authCheck } = require('../../helpers/auth');
const categoryController = require('./category.controller');

const router = express.Router();

router.get('/search/', categoryController.findCategoryByTitle);
router.get('/', categoryController.getAllCategory);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authCheck, categoryController.createCategory);
router.put('/:id', authCheck, categoryController.updateCategory);
router.delete('/:id', authCheck, categoryController.deleteCategory);

module.exports = router;
