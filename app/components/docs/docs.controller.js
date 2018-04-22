const path = require('path');

const showDocs = function (req, res, next) {
  res.render(path.join(__dirname, 'docs'));
};

module.exports = {
  showDocs,
};
