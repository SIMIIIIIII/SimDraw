import { sendError } from '../middlewares/apiResponse';
import { Request, Response, NextFunction } from 'express';
import {SessionData, Req} from '../types/sessionTypes'

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!(req.session as SessionData).user) {
    sendError(res, 'Veillez vous connecter', 401);
    return;
  }
  next();
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!(req.session as SessionData).user?.admin) {
    sendError(res, 'Vous n\êtes pas administrateur', 403);
    return;
  }
  next();
};

export const failIfConnected = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if ((req.session as SessionData).user){
    sendError(res, 'Please logout', 430);
    return
  }
  next();
}


export const checkAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  (req as Req).isAuthenticated = !!(req.session as SessionData).user;
  next();
};