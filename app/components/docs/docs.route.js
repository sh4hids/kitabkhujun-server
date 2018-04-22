const express = require('express');
const docsController = require('./docs.controller');

const router = express.Router();

router.get('/', docsController.showDocs);

module.exports = router;
