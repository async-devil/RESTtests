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
    .catch((err: any) => res.status(err.message).send(err.message));
});

/*------------------------------------------------------------------------------------------*/

route.get('/users/me', auth, (req: Request, res: Response) => {
  res.send(req.user);
});

/*------------------------------------------------------------------------------------------*/

route.patch('/users/me', auth, (req: Request, res: Response) => {
  Method.updateModelDocumentByIDAndOwnerID(User, req.user._id, req.user._id, req.body, [
    'age',
    'name',
    'password',
  ])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
});

/*------------------------------------------------------------------------------------------*/

route.delete('/users/me', auth, (req: Request, res: Response) => {
  Method.deleteModelDocumentByID(User, req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
});

/*------------------------------------------------------------------------------------------*/

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

route.post('/users/logout', auth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/*------------------------------------------------------------------------------------------*/

route.post('/users/logoutAll', auth, async (req: Request, res: Response) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/*------------------------------------------------------------------------------------------*/

export { route as default };
