import { Document } from 'mongoose';
declare module 'express-serve-static-core' {
  interface Request {
    user: Document<any>;
  }
}
