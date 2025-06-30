const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/, // regex de email
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  }
});

module.exports = mongoose.model('User', UserSchema);
