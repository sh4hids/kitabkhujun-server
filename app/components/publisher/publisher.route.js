const express = require('express');
const { authCheck: { ensureAuthenticated, isModerator } } = require('../../helpers/auth');
const publisherController = require('./publisher.controller');

const router = express.Router();

router.get('/search/', publisherController.findPublisherByTitle);
router.get('/', publisherController.getAllPublisher);
router.get('/:id/books', publisherController.getBookByPublisher);
router.get('/:id', publisherController.getPublisherById);
router.post('/', ensureAuthenticated, publisherController.createPublisher);
router.put('/:id', ensureAuthenticated, publisherController.updatePublisher);
router.delete('/:id', isModerator, publisherController.deletePublisher);

module.exports = router;
