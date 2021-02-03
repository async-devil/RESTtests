require('dotenv').config();
require('./db/mongoose');

import express, { Request, Response } from 'express';

import User from './models/user.model';
import Task from './models/task.model';
import Methods from './Methods';

const app = express();
const port = process.env.APP_PORT || 3000;
const Method = new Methods();

app.use(express.json());

/*------------------------------------------------------------------------------------------*/

app.put('/users', (req: Request, res: Response) => {
  Method.putModelDocument(User, req.body)
    .then((user) => res.status(201).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.get('/users', (req: Request, res: Response) => {
  Method.getAllExistingModelDocuments(User)
    .then((users) => res.status(200).send(users))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.get('/users/:id', (req: Request, res: Response) => {
  Method.getModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.patch('/users/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.delete('/users/:id', (req: Request, res: Response) => {
  Method.deleteModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(typeof err == 'number' ? err : 500).send());
});

/*------------------------------------------------------------------------------------------*/

app.put('/tasks', (req: Request, res: Response) => {
  Method.putModelDocument(Task, req.body)
    .then((task) => res.status(201).send(task))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.get('/tasks', (req: Request, res: Response) => {
  Method.getAllExistingModelDocuments(Task)
    .then((tasks) => res.send(tasks))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  Method.getModelDocumentByID(Task, req.params.id)
    .then((task) => res.send(task))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.patch('/tasks/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(Task, req.params.id, req.body, ['description', 'completed'])
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  Method.deleteModelDocumentByID(Task, req.params.id)
    .then((task) => res.status(200).send(task))
    .catch((err) => res.status(typeof err == 'number' ? err : 500).send());
});
/*------------------------------------------------------------------------------------------*/

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
