import express from 'express';
import pointController from '../controllers/point.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Retrieve start and finish racepoints from an specific event
router.get('/findStartAndFinish/:eventId', pointController.findStartAndFinish);

// Retrieve all racepoints from an specific event
router.get('/fromEventId/:eventId', pointController.findAllEventPoints);

// Creates a new route of racepoints for an event
router.post('/createRoute/:eventId', pointController.createRoute);

export default router;
