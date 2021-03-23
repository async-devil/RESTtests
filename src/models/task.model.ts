import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  desciption: string;
  completed: boolean;
  owner: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export default mongoose.model<ITask>('Task', TaskSchema);
