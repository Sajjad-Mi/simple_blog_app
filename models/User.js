const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  main: {
    type: String, 
  }
});
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter an email'],
      validate: [isEmail, 'Please enter a valid email']

    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Your password shoud be at least 6 char'],
    },
    blogs:[blog]
  });
  userSchema.pre('save', async (next)=> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  const User = mongoose.model('user', userSchema);

  module.exports = User;  