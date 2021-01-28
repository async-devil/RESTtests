const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Invalid email');
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error('Age can`t be negative');
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 14,
    validate(value) {
      if (value.search(/ /gm) !== -1) throw new Error('Spaces were detected');
      if (value.search(/[^a-zA-Z0-9@\.\?\+\*\^\$\\\(\)\[\]\{\}\|]/gm) !== -1)
        throw new Error('Invalid symbols detected');
      if (value.search(/[@\.\?\+\*\^\$\\\(\)\[\]\{\}\|]/gm) === -1)
        throw new Error('Special symbols weren`t detected');
      if (value.search(/[0-9]/gm) === -1) throw new Error('Numbers weren`t detected');
    },
  },
});

module.exports = User;
