import express from 'express';
import authorize from '../middlewares/authorize';
import registrationController from '../controllers/registration.controller';

// eslint-disable-next-line new-cap
const router = express.Router();

// Create a new EventRegistration
router.post('/registration/', authorize, registrationController.create);

// Retrieve all EventRegistrations
router.get('/registration/', authorize, registrationController.findAll);

// Retrieve all EventRegistrations with ship that is owned by user registrered on token
//router.get('/eventRegistration/findEventRegFromUsername/:eventId', authorize, registrationController.findEventRegFromUsername); 

// Create an EventRegistration
//router.post('/eventRegistration/signUp', authorize, registrationController.signUp) 

// Delete an EventRegistration with given eventRegId
//router.delete('/eventRegistration/:eventRegId', authorize, registrationController.delete); 

// Creates an EventRegistration
//router.post('/eventRegistration/addParticipant', authorize, registrationController.addParticipant); 

// Retrieve all eventRegistration with the given eventId
router.get('/eventRegistration/getParticipants/:eventId', registrationController.getParticipants); 

// Update EventRegistration
//router.put('/eventRegistration/updateParticipant/:eventRegId', authorize, registrationController.updateParticipant); 

export default router;
