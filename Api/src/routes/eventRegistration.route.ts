import express, { Router } from 'express';
import eventRegistration from '../controllers/eventRegistration.controller';

// eslint-disable-next-line new-cap
const router: Router = express.Router();

// Create a new EventRegistration
router.post('/', eventRegistration.create);

// Retrieve all EventRegistrations
router.get('/', eventRegistration.findAll);

// Retrieve all EventRegistrations with ship that is owned by user registrered on token
router.get('/findEventRegFromUsername/:eventId', eventRegistration.findEventRegFromUsername);

// Create an EventRegistration
router.post('/signUp', eventRegistration.signUp)

// Delete an EventRegistration with given eventRegId
router.delete('/:eventRegId', eventRegistration.remove);

// Creates an EventRegistration
router.post('/addParticipant', eventRegistration.addParticipant);

// Retrieve all EventRegistrations with the given eventId
router.get('/getParticipants/:eventId', eventRegistration.getParticipants);

// Update EventRegistration 
router.put('/updateParticipant/:eventRegId', eventRegistration.updateParticipant);

export default router;