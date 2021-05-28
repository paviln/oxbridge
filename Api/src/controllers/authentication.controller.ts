import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {getJwtSecret} from '../config/config';

const Authorize = (req: Request, res: Response, role: string, callback: any) => {
  // Checks if a token is provided
  const token = req.headers['x-access-token'];
  if (!token) {
    return callback(res.status(401).send({ auth: false, message: 'No token provided' }));
  }

  // Verifying the token
  jwt.verify(token as string, getJwtSecret, function (err, decoded: any) {
    if (err) {
      return callback(res.status(500).send({ auth: false, message: 'Failed to authenticate token' }));
    }  if (!decoded) {
      return callback(res.status(401).send({ auth: false, message: 'No payload provided' }));
    }
    // Verifying that the request is allowed by the requesting role
    if (role === 'admin' && decoded.role !== 'admin') {
      return callback(res.status(401).send({ auth: false, message: 'Not authorized' }));
    }

    return callback(null, decoded);
  });
};

export default Authorize;
