import { Request, Response, Router } from 'express';

import Task from '../models/task.model';
import Methods from '../Methods';
import auth from '../middleware/auth';

const Method = new Methods();
const route = Router();

/*------------------------------------------------------------------------------------------*/

route.put('/tasks', auth, (req: Request, res: Response) => {
  Method.putModelDocument(Task, { ...req.body, owner: req.user._id })
    .then((task) => res.status(201).send(task))
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.get('/tasks', auth, async (req: Request, res: Response) => {
  try {
    await req.user.populate('tasks').execPopulate();

    const tasks = req.user.tasks;
    if (tasks.length === 0) return res.status(404).send('There are no tasks');

    res.send(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

route.get('/tasks/:id', auth, async (req: Request, res: Response) => {
  Method.getModelDocumentByIDAndOwnerID(Task, req.params.id, req.user._id)
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.patch('/tasks/:id', auth, (req: Request, res: Response) => {
  Method.updateModelDocumentByIDAndOwnerID(Task, req.params.id, req.user._id, req.body, [
    'description',
    'completed',
  ])
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.delete('/tasks/:id', auth, (req: Request, res: Response) => {
  Method.deleteModelDocumentByIDAndOwnerID(Task, req.params.id, req.user._id)
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(err.status).send(err.message));
});

/*------------------------------------------------------------------------------------------*/

export { route as default };
