import { Request, Response, Router } from 'express';
import Task from '../models/task.model';
import Methods from '../Methods';

const Method = new Methods();
const route = Router();

/*------------------------------------------------------------------------------------------*/

route.put('/tasks', (req: Request, res: Response) => {
  Method.putModelDocument(Task, req.body)
    .then((task) => res.status(201).send(task))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.get('/tasks', (req: Request, res: Response) => {
  Method.getAllExistingModelDocuments(Task)
    .then((tasks) => res.send(tasks))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.get('/tasks/:id', (req: Request, res: Response) => {
  Method.getModelDocumentByID(Task, req.params.id)
    .then((task) => res.send(task))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.patch('/tasks/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(Task, req.params.id, req.body, ['description', 'completed'])
    .then((task) => res.status(200).send(task))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.delete('/tasks/:id', (req: Request, res: Response) => {
  Method.deleteModelDocumentByID(Task, req.params.id)
    .then((task) => res.status(200).send(task))
    .catch((err) => res.status(typeof err == 'number' ? err : 500).send());
});

/*------------------------------------------------------------------------------------------*/

export { route as default };
