require('dotenv').config();
require('./db/mongoose');

import express, { Request, Response } from 'express';

import User, { IUser } from './models/user.model';
import Task, { ITask } from './models/task.model';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

app.post('/users', (req: Request, res: Response) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((e: any) => {
      res.status(400).send(e.message);
    });
});

app.get('/users', (req: Request, res: Response) => {
  User.find({})
    .then((users: IUser) => {
      res.status(200).send(users);
    })
    .catch((err: any) => {
      res.status(500).send();
    });
});

app.get('/users/:id', (req: Request, res: Response) => {
  const _id: string = req.params.id;

  User.findById(_id)
    .then((user: IUser) => {
      if (!user) return res.status(404).send();

      res.status(200).send(user);
    })
    .catch((err: any) => {
      res.status(500).send(err.message);
    });
});

app.post('/tasks', (req: Request, res: Response) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err: any) => {
      res.status(400).send(err.message);
    });
});

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
