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

/*
  ? descending|ascending
  ! /tasks? completed=boolean & limit=number & skip=number & sortBy=propertyName:desc|asc
  & GET /tasks?completed=true&limit=2&skip=2&sortBy=completed:desc
  ^ des => true...false
  ^ asc => false...true
*/
route.get('/tasks', auth, async (req: Request, res: Response) => {
  const match = {} as {
    completed: boolean;
  };
  if (req.query.completed) match.completed = req.query.completed === 'true';

  let sort = {};
  if (req.query.sortBy) {
    const parts = (req.query.sortBy as string).split(':');
    if (parts[1] === 'desc' || parts[1] === 'asc')
      sort = new Object({ [`${parts[0]}`]: parts[1] === 'desc' ? -1 : 1 });
    //? -1 = desc  1 = asc
  }

  const limit = () => {
    const parsedValue = parseInt(req.query.limit as string);
    return parsedValue ? parsedValue : 0; //? if NaN
  };
  const skip = () => {
    const parsedValue = parseInt(req.query.skip as string);
    return parsedValue ? parsedValue : 0;
  };

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: limit(),
          skip: skip(),
          sort,
        },
      })
      .execPopulate();

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
