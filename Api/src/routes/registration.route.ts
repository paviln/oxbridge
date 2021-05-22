import express from 'express';
import registrationController from '../controllers/registration.controller';

const router = express.Router();

// Create a new EventRegistration
router.post('/eventRegistration/', registrationController.create); 

// Retrieve all EventRegistrations
router.get('/eventRegistration/', registrationController.findAll); 

// Retrieve all EventRegistrations with ship that is owned by user registrered on token
//router.get('/eventRegistration/findEventRegFromUsername/:eventId', registrationController.findEventRegFromUsername); 

// Create an EventRegistration
//router.post('/eventRegistration/signUp', registrationController.signUp) 

// Delete an EventRegistration with given eventRegId
//router.delete('/eventRegistration/:eventRegId', registrationController.delete); 

// Creates an EventRegistration
//router.post('/eventRegistration/addParticipant', registrationController.addParticipant); 

// Retrieve all eventRegistration with the given eventId
router.get('/eventRegistration/getParticipants/:eventId', registrationController.getParticipants); 

// Update EventRegistration
//router.put('/eventRegistration/updateParticipant/:eventRegId', registrationController.updateParticipant); 

export default router;
