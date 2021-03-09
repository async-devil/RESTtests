import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  desciption: string;
  completed: boolean;
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
});

export default mongoose.model<ITask>('Task', TaskSchema);
