import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config';
import {Request, Response} from 'express';
import User, {IUser} from '../models/user';

// Retrieve and return all users from the database.
const findAll = (req: Request, res: Response) => {
  // Finding all users
  User.find({}, (err: any, users: IUser) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retriving users'});
    }
    res.status(200).json(users);
  });
};

// Find a single user with the specified email
const findOne = (req: Request, res: Response) => {
  // Finding the user with the given userId
  User.findOne({email: req.params.email}, (err: any, user: IUser) => {
    if (err) {
      return res.status(500).send({
        message: 'Error retrieving user with userName ' + req.params.email});
    }
    if (!user) {
      return res.status(404).send({
        message: 'User not found with userName ' + req.params.email});
    }

    res.status(200).send(user);
  });
};

// Update a user with the specified email
const update = (req: Request, res: Response) => {
  // Updating the user
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User(req.body);
  user.password = hashedPassword;
  user.isAdmin = req.body.isAdmin;
  const filter = {email: user.email};
  User.findOneAndUpdate(filter, user, null, (err: any, user: IUser | null) => {
    if (err) {
      res.send(err);
    }
    if (!user) {
      return res.status(404).send({
        message: 'User not found with id ' + req.params.email});
    }

    res.status(202).json(user);
  });
};

// Delete a user with the specified email
const remove = (req: Request, res: Response) => {
  const filter = {email: req.params.email};
  User.findOneAndDelete(filter, null, (err: any, user: IUser | null) => {
    if (err) {
      res.send(err);
    }
    if (!user) {
      return res.status(404).send({
        message: 'User not found with id ' + req.params.email},
      );
    }

    res.status(202).json(user);
  });
};

// Register a new admin user and return token
const registerAdmin = (req: Request, res: Response) => {
  // Checking that no other user with that username exists
  User.find({email: req.body.email}, function(err, users) {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retriving users'},
      );
    }

    if (users) {
      return res.status(409).send(
          {
            message: 'User with that username already exists',
          },
      );
    }

    // Creating the new user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User(req.body);
    user.password = hashedPassword;
    user.isAdmin = true;

    user.save(function(err) {
      if (err) {
        return res.status(500)
            .send('There was a problem registrating the user');
      }
      const payload = {id: user.email, isAdmin: true};
      const token = jwt.sign(payload, config.jwtSectetKey, {expiresIn: 86400});
      res.status(201).send({auth: true, token: token});
    });
  });
};

// Register a new user and return token
const register = (req: Request, res: Response) => {
  // Checking that no user with that username exists
  const filter = {emailUsername: req.body.emailUsername};
  User.findOne(filter, (err: any, user: IUser) => {
    if (err) {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retriving users'});
    }

    if (user) {
      return res.status(409).send({
        message: 'User with that username already exists'});
    }

    // Creating the user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser: IUser = new User(req.body);
    newUser.password = hashedPassword;
    newUser.isAdmin = false;

    newUser.save((err) => {
      if (err) {
        return res.status(500)
            .send('There was a problem registrating the user');
      }

      // returning a token
      const payload = {id: newUser.email, isAdmin: false};
      const token = jwt.sign(payload, config.jwtSectetKey, {expiresIn: 86400});
      res.status(201).send({auth: true, token: token});
    });
  });
};

// Check login info and return login status
const login = (req: Request, res: Response) => {
  // Find the user and validate the password
  const filter = {emailUsername: req.body.emailUsername};
  User.findOne(filter, (err: any, user: IUser) => {
    if (err) {
      return res.status(500).send('Error on the server');
    }
    if (!user) {
      return res.status(403).json('Username incorrect');
    }

    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) {
      return res.status(401).send(
          {
            auth: false,
            token: null,
            message: 'Invalid password',
          },
      );
    }
    const payload = {id: user.email, role: user.isAdmin};
    const token = jwt.sign(payload, config.jwtSectetKey, {expiresIn: 86400});
    res.status(200).send(
        {
          emailUsername: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          auth: true,
          token: token,
        });
  });
};

export default {
  findAll,
  findOne,
  update,
  remove,
  registerAdmin,
  register,
  login,
};
