import express from 'express';
import shipController from '../controllers/ship.controller';
import authorize from '../middlewares/authorize';
// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new ship
router.post('/', authorize("user"), shipController.create);

// Retrieve all ships
router.get('/', authorize("all"), shipController.findAll);

// Retrieve a single ship
router.get('/:shipId', authorize("user"), shipController.findOne);

// Retrieve all ships participating in the given event
router.get('/fromEventId/:eventId', shipController.findFromEventId);

//Retrieve all user ships
router.get('/myShips/fromUsername', authorize("user"), shipController.findMyShips); 

// Update a ship
router.put('/:shipId', authorize("admin"), shipController.update); 

// Delete a ship
router.delete('/:shipId', authorize("all"), shipController.remove);

export default router;
