import mongoose, { Schema, Document, Date } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

import Task, { ITask } from './task.model';

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
  tokens: {
    token: string;
    _id: string;
  }[];
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

interface IDocument extends Document {
  [key: string]: any;
}

const UserSchema: Schema = new Schema(
  {
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
      maxlength: 72,
      validate(value: string) {
        const strongPassword = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
        );
        if (!strongPassword.test(value)) throw new Error('Password is too weak');
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

UserSchema.pre('save', async function (this: IDocument, next) {
  const user = this;

  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

  next();
});

UserSchema.pre('remove', async function (this: IDocument, next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

UserSchema.methods.toJSON = function (this: IDocument) {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

export default mongoose.model<IUser>('User', UserSchema);
