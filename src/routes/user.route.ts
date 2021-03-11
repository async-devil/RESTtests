import { Request, Response, Router } from 'express';

import User from '../models/user.model';
import Methods from '../Methods';
import auth from '../middleware/auth';

const Method = new Methods();
const route = Router();

/*------------------------------------------------------------------------------------------*/

route.put('/users', (req: Request, res: Response) => {
  Method.putModelDocument(User, req.body)
    .then((user) => {
      Method.generateAuthToken(user)
        .then((token) => {
          res.status(201).send({ user, token });
        })
        .catch((err: any) => {
          throw res.status(500).send(err.message);
        });
    })
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.get('/users/me', auth, (req: Request, res: Response) => {
  res.send(req.user);
});

route.get('/users/:id', (req: Request, res: Response) => {
  Method.getModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err: any) => {
      console.log(err);
      return res.status(err.status).send(err.message);
    });
});

route.patch('/users/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name', 'password'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.delete('/users/:id', (req: Request, res: Response) => {
  Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name', 'password'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
});

route.post('/users/login', (req: Request, res: Response) => {
  Method.loginByCredentialAndValidatePassword(User, req.body)
    .then((user) => {
      Method.generateAuthToken(user)
        .then((token) => {
          res.status(200).send({ user, token });
        })
        .catch((err: any) => {
          throw res.status(err.status).send(err.message);
        });
    })
    .catch((err: any) => res.status(err.status).send(err.message));
});

/*------------------------------------------------------------------------------------------*/

export { route as default };
