const express = require('express');
const { authCheck } = require('../../helpers/auth');
const publisherController = require('./publisher.controller');

const router = express.Router();

router.get('/search/', publisherController.findPublisherByTitle);
router.get('/', publisherController.getAllPublisher);
router.get('/:id/books', publisherController.getBookByPublisher);
router.get('/:id', publisherController.getPublisherById);
router.post('/', authCheck, publisherController.createPublisher);
router.put('/:id', authCheck, publisherController.updatePublisher);
router.delete('/:id', authCheck, publisherController.deletePublisher);

module.exports = router;
