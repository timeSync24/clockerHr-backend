// src/types/express.d.ts
import { TokenPayload } from './token';

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload & { _id: string };
  }
}
