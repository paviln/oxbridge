import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export default (req: Request, res: Response, next: any) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, config.jwtSectetKey as string, (err: any, user: any) => {

        if (err) return res.sendStatus(403)

        if (!user.isAdmin)
            return res.status(401).send({ auth: false, message: 'Not authorized' });

        req.body.user = user

        next();
    });
}