const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const { Schema } = mongoose;

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.plugin(findOrCreate);

module.exports = mongoose.model('Author', authorSchema);
