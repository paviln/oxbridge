import express from 'express';
import teamController from '../controllers/team.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new team
router.post('/', teamController.create);

// Retrieve all teams
router.get('/', teamController.findAll);

// Retrieve a single team
router.get('/:shipId', teamController.findOne);

// Retrieve all ships participating in the given event
router.get('/fromEventId/:eventId', teamController.findFromEventId);

// Retrieve all user teams
router.get('/myShips/fromUsername', teamController.findTeams);

// Update a myShips
router.put('/:shipId', teamController.update);

// Delete a ship
router.delete('/:shipId', teamController.remove);

export default router;
