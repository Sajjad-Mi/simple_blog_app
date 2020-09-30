const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  main: {
    type: String, 
  }
});
const userSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      validate: [isEmail, 'Please enter a valid email']

    },
    password: {
      type: String,
      minlength: [6, 'Your password shoud be at least 6 char'],
    },
    blogs:[blogSchema]
  });
  userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('email or password is wrong');
    }
    throw Error('email or password is wrong');
  };
  const User = mongoose.model('user', userSchema);

  module.exports = User;  