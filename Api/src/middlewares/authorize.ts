import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {getJwtSecret} from '../config/config';
import {IUser, Roles} from '../models/user';

export default (roles: Roles[]) => {
  return [
    (async (req: Request, res: Response, next: any) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.sendStatus(401);
      const user: IUser = await jwt.verify(token, getJwtSecret()) as IUser;
      if (user == null) return res.sendStatus(401);
      if (roles.length && !roles.includes(user.role)) {
      // user's role is not authorized
        return res.status(401).json({message: 'Unauthorized'});
      }

      next();
    }),
  ];
};
