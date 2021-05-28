import console from 'console';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/config';

export default (role: String) => {
  return [
    (req: any, res: Response, next: any) => {
      const authHeader = req.headers['authorization'];
      const token = req.headers['x-access-token'];
      //const token = authHeader && authHeader.split(' ')[1];

      if (token == null) return res.sendStatus(401);

      jwt.verify(token, getJwtSecret(), (err: any, user: any) => {
        if (err) return res.sendStatus(403);

        if (role == "all" || user.role == role) {
          req.user = user;
          next();
        } else {
          return res.status(401).send({ auth: false, message: 'Not authorized' });
        }
      });
    }
  ];
};
