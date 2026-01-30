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

declare module 'express' {
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