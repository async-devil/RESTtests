require('dotenv').config();
require('./db/mongoose');

import express, { Request, Response } from 'express';
import { Document, Model } from 'mongoose';

import User, { IUser } from './models/user.model';
import Task, { ITask } from './models/task.model';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

class Methods {
  /**
   * @param model Mongoose model
   * @returns {Promise<Document[]>} Model objects
   */
  public async getAllExistingModelObjects(model: Model<any>) {
    return await model.find({});
  }

  /**
   * @param model Mongoose model
   * @param objectData Data of creating document
   * @returns {Promise<Document>} Created document
   */
  public async putModelObject(model: Model<any>, objectData: Object) {
    const modelObject: Document = new model(objectData);

    return await modelObject.save();
  }

  /**
   * @param model Mongoose model
   * @param id String version of searching document ObjectID
   * @returns {Promise<Document>} Searched document
   * @throws {404|400} Http status codes
   */
  public async getModelObjectByID(model: Model<Document>, id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw 400;

    const modelObject: Document = await model.findById(id);
    if (!modelObject) throw 404;

    return modelObject;
  }
}

const Method = new Methods();

app.put('/users', (req: Request, res: Response) => {
  Method.putModelObject(User, req.body)
    .then((user) => res.send(user))
    .catch((err: any) => {
      if (err != 500 && err == Number) return res.status(err).send();
      res.status(500).send();
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
      if (!user) return res.status(404).send('User not found');

      res.status(200).send(user);
    })
    .catch((err: any) => {
      if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send('ID is not valid ObjectID');
      res.status(500).send(err.message);
    });
});

app.put('/tasks', (req: Request, res: Response) => {
  Method.putModelObject(Task, req.body)
    .then((task) => res.send(task))
    .catch((err: any) => {
      if (err != 500 && err == Number) return res.status(err).send();
      res.status(500).send();
    });
});

app.get('/tasks', (req: Request, res: Response) => {
  Task.find({})
    .then((task: IUser) => {
      if (!task) return res.status(404).send();

      res.status(200).send(task);
    })
    .catch((err: any) => {
      res.status(500).send(err.message);
    });
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  const _id: string = req.params.id;

  Task.findById(_id)
    .then((task: IUser) => {
      if (!task) return res.status(404).send('Task not found');

      res.status(200).send(task);
    })
    .catch((err: any) => {
      if (!_id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send('ID is not valid ObjectID');
      res.status(500).send(err.message);
    });
});

/*------------------------------------------------------------------------------------------*/
/** @alias UpdateTaskAndCount*/
interface UpdateTaskAndCount {
  /** Number of uncompleted tasks */
  count: number;
  /** Task with updates */
  task: ITask;
  /** Task without changes */
  prevTask: ITask;
}

/**
 * @param id string version of task`s ObjectID
 * @param status status of task (completed or not)
 * @returns {Promise<UpdateTaskAndCount>} @link UpdateTaskAndCount
 * @throws {400}
 */
const updateTaskAndCount = async (id: string, status: boolean) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) throw 400;

  const task: ITask = await Task.findOneAndUpdate(
    { _id: id },
    {
      completed: status,
    },
  );
  console.log(task);
  if (!task) throw 404;
  const updatedTask: ITask = await Task.findById(id);
  const unCompletedTasks: number = await Task.countDocuments({ completed: true });

  return { count: unCompletedTasks, task: updatedTask, prevTask: task };
};

app.patch('/tasks/:id/:status', (req: Request, res: Response) => {
  const _id: string = req.params.id;
  const _status: boolean = req.params.status == 'true' ? true : false;

  updateTaskAndCount(_id, _status)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err != 500 && typeof err == 'number') {
        return res.status(err).send();
      }
      res.status(500).send();
    });
});

/*------------------------------------------------------------------------------------------*/

app.listen(port, () => {
  console.log(`Server is on port ${port}`);
});
