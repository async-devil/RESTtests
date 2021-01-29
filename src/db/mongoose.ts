import mongoose from 'mongoose';

mongoose.connect(`${process.env.DB_HOST || 'mongodb://127.0.0.1:27017'}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
