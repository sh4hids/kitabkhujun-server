const express = require('express');
const { authCheck: { ensureAuthenticated, isModerator } } = require('../../helpers/auth');
const categoryController = require('./category.controller');

const router = express.Router();

router.get('/search/', categoryController.findCategoryByTitle);
router.get('/', categoryController.getAllCategory);
router.get('/:id/books', categoryController.getBookByCategory);
router.get('/:id', categoryController.getCategoryById);
router.post('/', ensureAuthenticated, categoryController.createCategory);
router.put('/:id', ensureAuthenticated, categoryController.updateCategory);
router.delete('/:id', isModerator, categoryController.deleteCategory);

module.exports = router;
