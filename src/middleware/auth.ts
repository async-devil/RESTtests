import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.model';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.header('Authorization'))
      throw { message: "Authoriation header hasn't found", status: 400 };
    const token = (req.header('Authorization') as string).replace('Bearer ', '');

    try {
      var { _id } = jwt.verify(token, 'SuperSecretCode') as {
        _id: string;
      };
    } catch (err) {
      throw { message: 'Invalid token', status: 401 };
    }

    const user = await User.findOne({ _id: _id, 'tokens.token': token });
    if (!user) throw { message: '', status: 404 };

    req.user = user;
    next();
  } catch (err) {
    if (err.status) {
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
};

export { auth as default };
