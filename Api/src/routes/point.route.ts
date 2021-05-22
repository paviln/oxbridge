import express from 'express';
import pointController from '../controllers/point.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Retrieve start and finish racepoints from an specific event
router.get('/racePoints/findStartAndFinish/:eventId',
    pointController.findStartAndFinish);

// Retrieve all racepoints from an specific event
router.get('/racepoints/fromEventId/:eventId',
    pointController.findAllEventRacePoints);

// Creates a new route of racepoints for an event
router.post('/racepoints/createRoute/:eventId', pointController.createRoute);

export default router;
