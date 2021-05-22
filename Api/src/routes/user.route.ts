import express from 'express';
import userController from '../controllers/user.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Retrieve all Users
router.get('/', userController.findAll);

// Retrieve a single User with the given email
router.get('/:email', userController.findOne);

// Update a User with the given email
router.put('/:email', userController.update);

// Delete a User with the given email
router.delete('/:email', userController.remove);

// Register a new admin
router.post('/registerAdmin', userController.registerAdmin);

// Register a new user
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

export default router;
