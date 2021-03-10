import { Document } from 'mongoose';
declare namespace Express {
  export interface Request {
    user: Document<any>;
  }
}
