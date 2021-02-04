require('dotenv').config();
require('./db/mongoose');

import express from 'express';
import UserRoute from './routes/user.route';
import TaskRoute from './routes/task.route';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json(), UserRoute, TaskRoute);

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
