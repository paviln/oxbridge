import express from 'express';
import racePointController from '../controllers/racePoint.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Retrieve start and finish racepoints from an specific event
router.get('/racePoints/findStartAndFinish/:eventId',
    racePointController.findStartAndFinish);

// Retrieve all racepoints from an specific event
router.get('/racepoints/fromEventId/:eventId',
    racePointController.findAllEventRacePoints);

// Creates a new route of racepoints for an event
router.post('/racepoints/createRoute/:eventId',
    racePointController.createRoute);

export default router;
