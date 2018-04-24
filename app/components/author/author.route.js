const express = require('express');
const { authCheck } = require('../../helpers/auth');
const authorController = require('./author.controller');

const router = express.Router();

router.get('/', authorController.getAllAuthor);
router.get('/:id', authorController.getAuthorById);
router.post('/', authCheck, authorController.createAuthor);
router.put('/:id', authCheck, authorController.updateAuthor);
router.delete('/:id', authCheck, authorController.deleteAuthor);

module.exports = router;
