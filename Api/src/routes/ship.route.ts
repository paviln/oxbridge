import express from 'express';
import shipController from '../controllers/ship.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new ship
router.post('/', shipController.create);

// Retrieve all ships
router.get('/', shipController.findAll);

// Retrieve a single ship
router.get('/:shipId', shipController.findOne);

// Retrieve all ships participating in the given event
router.get('/fromEventId/:eventId', shipController.findFromEventId);

//Retrieve all user ships
router.get('/ships/myShips/fromUsername', shipController.findMyShips); 

// Update a ship
router.put('/ships/:shipId', shipController.update); 

// Delete a ship
router.delete('/:shipId', shipController.remove);

export default router;
