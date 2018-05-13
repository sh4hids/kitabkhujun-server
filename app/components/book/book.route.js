const express = require('express');
const { authCheck } = require('../../helpers/auth');
const bookController = require('./book.controller');

const router = express.Router();

router.get('/search/', bookController.findBookByTitle);
router.get('/', bookController.getAllBook);
router.get('/:id', bookController.getBookById);
router.post('/', authCheck, bookController.createBook);
router.put('/:id/read', authCheck, bookController.readBook);
router.put('/:id', authCheck, bookController.updateBook);
router.delete('/:id', authCheck, bookController.deleteBook);

module.exports = router;
