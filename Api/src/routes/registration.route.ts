import express from 'express';
import registrationController from '../controllers/registration.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new EventRegistration
router.post('/', registrationController.create); 

// Retrieve all EventRegistrations
router.get('/', registrationController.findAll); 

//Retrieve all EventRegistrations with ship that is owned by user registrered on token
router.get('/findEventRegFromUsername/:eventId', registrationController.findEventRegFromUsername);

// Create an EventRegistration
router.post('/signUp', registrationController.signUp);

// Delete an EventRegistration with given eventRegId
router.delete('/:eventRegId', registrationController.delete);

// Creates an EventRegistration
router.post('/addParticipant', registrationController.addParticipant);

// Retrieve all eventRegistration with the given eventId
router.get('/getParticipants/:eventId', registrationController.getParticipants);

// Update EventRegistration
router.put('/updateParticipant/:eventRegId', registrationController.updateParticipant);

export default router;
