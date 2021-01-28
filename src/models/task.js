const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Task', {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Task;
