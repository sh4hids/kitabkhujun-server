const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
  facebookId: String,
  googleId: String,
  githubId: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isModerator: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
