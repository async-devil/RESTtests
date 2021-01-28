require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

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
    validate(value: string) {
      if (!validator.isEmail(value)) throw new Error('Invalid email');
    },
  },
  age: {
    type: Number,
    validate(value: number) {
      if (value < 0) throw new Error('Age can`t me negative');
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 14,
    validate(value: string) {
      if (value.search(/ /gm) !== -1) throw new Error('Spaces were detected');
      if (value.search(/[^a-zA-Z0-9@\.\?\+\*\^\$\\\(\)\[\]\{\}\|]/gm) !== -1)
        throw new Error('Invalid symbols detected');
      if (value.search(/[@\.\?\+\*\^\$\\\(\)\[\]\{\}\|]/gm) === -1)
        throw new Error('Special symbols weren`t detected');
      if (value.search(/[0-9]/gm) === -1) throw new Error('Numbers weren`t detected');
    },
  },
});

const Task = mongoose.model('Task', {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// const test = new Task({ description: 'Check task model', completed: true });
const test = new User({
  name: 'Test',
  age: 22,
  email: 'bababooey@sas.sus',
  password: 'S',
});

test
  .save()
  .then((res: any) => console.log(res))
  .catch((err: any) => console.log(err));
