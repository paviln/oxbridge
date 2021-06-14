import express from 'express';
import userController from '../controllers/user.controller';
import authorize from '../middlewares/authorize';
// eslint-disable-next-line new-cap
const router = express.Router();

// Retrieve all Users
router.get('/', authorize("admin"), userController.findAll);

// Retrieve a single User with the given emailUsername
router.get('/:userName', authorize("user"), userController.findOne);

// Update a User with the given emailUsername
router.put('/:userName', userController.update);

// Delete a User with the given emailUsername
router.delete('/:userName', authorize("user"), userController.remove);

// Register a new admin
router.post('/registerAdmin', userController.registerAdmin);

// Register a new user
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

//new pw
router.post('/forgotPassword', userController.forgotPassword);

export default router;
