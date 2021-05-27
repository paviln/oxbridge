import express from 'express';
import locationRegistrationController from '../controllers/locationRegistration';

// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new LocationRegistration
router.post('/', locationRegistrationController.create);

// Retrieve latest LocationRegistrations from specified event
router.get('/getLive/:eventId', locationRegistrationController.getLive);

// Retrieve all LocationRegistrations from specified event
router.get('/getReplay/:eventId', locationRegistrationController.getReplay);

// Retrieve scoreboard from specific event
router.get('/getScoreboard/:eventId', locationRegistrationController.getScoreboard);

// Delete all locationRegistrations with a given eventRegId
router.delete('/deleteFromEventRegId/:eventId', locationRegistrationController.deleteFromEventRegId);

export default router;
