import mongoose, { Schema, Document } from 'mongoose';
const bcrypt = require('bcrypt');
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
}

interface IDocument extends Document {
  [key: string]: any;
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
    unique: true,
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
      const strongPassword = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
      );
      if (!strongPassword.test(value)) throw new Error('Password is too weak');
    },
  },
});

UserSchema.pre('save', async function (this: IDocument, next) {
  const user = this;

  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

  next();
});

export default mongoose.model<IUser>('User', UserSchema);
