import { Request, Response, Router } from 'express';
import User from '../models/user.model';
import Methods from '../Methods';

const Method = new Methods();
const route = Router();

/*------------------------------------------------------------------------------------------*/

route.put('/users', (req: Request, res: Response) => {
  Method.putModelDocument(User, req.body)
    .then((user) => res.status(201).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.get('/users', (req: Request, res: Response) => {
  Method.getAllExistingModelDocuments(User)
    .then((users) => res.status(200).send(users))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.get('/users/:id', (req: Request, res: Response) => {
  Method.getModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.patch('/users/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
});

route.delete('/users/:id', (req: Request, res: Response) => {
  Method.deleteModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(typeof err == 'number' ? err : 500).send());
});

/*------------------------------------------------------------------------------------------*/

export { route as default };
