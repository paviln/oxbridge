import express from 'express';
import locationController from '../controllers/location.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new LocationRegistration
router.post('/locationRegistrations/', locationController.create);

// Retrieve latest LocationRegistrations from specified event
//router.get('/locationRegistrations/getLive/:eventId', locationController.getLive);

// Retrieve all LocationRegistrations from specified event
//router.get('/locationRegistrations/getReplay/:eventId', locationController.getReplay);

// Retrieve scoreboard from specific event
//router.get('/locationRegistrations/getScoreboard/:eventId', locationController.getScoreboard);

// Delete all locationRegistrations with a given eventRegId
router.delete('/locationRegistrations/deleteFromEventRegId/:eventId',
   locationController.deleteFromEventRegId);

export default router;
