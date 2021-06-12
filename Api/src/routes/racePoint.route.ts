import express from 'express';
import racePointController from '../controllers/racePoint.controller';
import authorize from '../middlewares/authorize';
// eslint-disable-next-line new-cap
const router = express.Router();

// Retrieve start and finish racepoints from an specific event
router.get('/findStartAndFinish/:eventId',
    racePointController.findStartAndFinish);

// Retrieve all racepoints from an specific event
router.get('/fromEventId/:eventId',
    racePointController.findAllEventRacePoints);

// Creates a new route of racepoints for an event
router.post('/createRoute/:eventId', authorize("admin"),
    racePointController.createRoute);

export default router;
