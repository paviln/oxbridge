import express from 'express';
import teamController from '../controllers/team.controller';

const router = express.Router();

// Create a new ship
router.post('/ships', teamController.create);

// Retrieve all ships
router.get('/ships', teamController.findAll);

// Retrieve a single ship
router.get('/ships/:shipId', teamController.findOne);

// Retrieve all ships participating in the given event
router.get('/ships/fromEventId/:eventId', teamController.findFromEventId);

// Retrieve all user teams
router.get('/ships/myShips/fromUsername', teamController.findTeams);

// Update a myShips

// Delete a ship
router.delete('/ships/:shipId', teamController.remove);

export default router;
