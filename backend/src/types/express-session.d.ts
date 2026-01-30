
import 'express-session';
import { Types } from 'mongoose';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: Types.ObjectId;
      username: string;
      emoji: string;
      admin: boolean;
    };
  }
}

import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    isAuthenticated?: boolean;
    currentUser?: {
      id: Types.ObjectId;
      username: string;
      emoji: string;
      admin: boolean;
    } | null;
  }
}