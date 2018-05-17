const express = require('express');
const { authCheck: { ensureAuthenticated, isModerator } } = require('../../helpers/auth');
const bookController = require('./book.controller');

const router = express.Router();

router.get('/search/', bookController.findBookByTitle);
router.get('/', bookController.getAllBook);
router.get('/:id', bookController.getBookById);
router.post('/', ensureAuthenticated, bookController.createBook);
router.put('/:id/read', ensureAuthenticated, bookController.readBook);
router.put('/:id', ensureAuthenticated, bookController.updateBook);
router.delete('/:id', isModerator, bookController.deleteBook);

module.exports = router;
