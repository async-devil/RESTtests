import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
}

const UserSchema: Schema = new Schema({
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
      if (value < 0) throw new Error('Age can`t be negative');
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    validate(value: string) {
      if (value.search(/ /gm) !== -1) throw new Error('Spaces were detected');
      if (value.search(/[^a-zA-Z0-9\@\.\?\+\*\^\$\\\(\)\[\]\{\}\|\~\-\%\'\"\`\<\>]/gm) !== -1)
        throw new Error('Invalid symbols detected');
      if (value.search(/[\@\.\?\+\*\^\$\\\(\)\[\]\{\}\|\~\-\%\'\"\`\<\>]/gm) === -1)
        throw new Error('Special symbols weren`t detected');
      if (value.search(/[0-9]/gm) === -1) throw new Error('Numbers weren`t detected');
    },
  },
});

export default mongoose.model<IUser>('User', UserSchema);
