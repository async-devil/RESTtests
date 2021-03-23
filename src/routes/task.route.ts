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
  const _id = req.params.id;

  try {
    const tasks = await Task.find({ owner: req.user._id });

    if (tasks.length === 0) return res.status(404).send('There are no tasks');

    res.send(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

route.get('/tasks/:id', auth, async (req: Request, res: Response) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send('Task not found');

    res.send(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

route.patch('/tasks/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(Task, req.params.id, req.body, ['description', 'completed'])
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.delete('/tasks/:id', (req: Request, res: Response) => {
  Method.deleteModelDocumentByID(Task, req.params.id)
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(err.status).send(err.message));
});

/*------------------------------------------------------------------------------------------*/

export { route as default };
