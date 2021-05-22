import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

// Retrieve all Users
router.get('/users', userController.findAll); 

// Retrieve a single User with the given emailUsername
router.get('/users/:userName', userController.findOne); 

// Update a User with the given emailUsername
router.put('/users/:userName', userController.update); 

// Delete a User with the given emailUsername
router.delete('/users/:userName', userController.remove); 

// Register a new admin
router.post('/users/registerAdmin', userController.registerAdmin); 

// Register a new user
router.post('/users/register', userController.register); 

// Login
router.post('/users/login', userController.login); 

export default router;