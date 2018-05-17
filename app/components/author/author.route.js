const express = require('express');
const { authCheck: { ensureAuthenticated, isModerator } } = require('../../helpers/auth');
const authorController = require('./author.controller');

const router = express.Router();

router.get('/search/', authorController.findAuthorByName);
router.get('/', authorController.getAllAuthor);
router.get('/:id/books', authorController.getBookByAuthor);
router.get('/:id', authorController.getAuthorById);
router.post('/', ensureAuthenticated, authorController.createAuthor);
router.put('/:id', ensureAuthenticated, authorController.updateAuthor);
router.delete('/:id', isModerator, authorController.deleteAuthor);

module.exports = router;
