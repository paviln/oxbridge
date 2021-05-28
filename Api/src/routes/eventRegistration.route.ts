import express, { Router } from 'express';
import eventRegistration from '../controllers/eventRegistration.controller';
import authorize from '../middlewares/authorize';
// eslint-disable-next-line new-cap
const router: Router = express.Router();

// Create a new EventRegistration
router.post('/', authorize, eventRegistration.create);

// Retrieve all EventRegistrations
router.get('/', authorize("admin"), eventRegistration.findAll);

// Retrieve all EventRegistrations with ship that is owned by user registrered on token
router.get('/findEventRegFromUsername/:eventId', authorize("user"), eventRegistration.findEventRegFromUsername);

// Create an EventRegistration
router.post('/signUp', authorize("user"), eventRegistration.signUp)

// Delete an EventRegistration with given eventRegId
router.delete('/:eventRegId', authorize("all"), eventRegistration.remove);

// Creates an EventRegistration
router.post('/addParticipant', authorize("admin"), eventRegistration.addParticipant);

// Retrieve all EventRegistrations with the given eventId
router.get('/getParticipants/:eventId', eventRegistration.getParticipants);

// Update EventRegistration 
router.put('/updateParticipant/:eventRegId', authorize("admin"), eventRegistration.updateParticipant);

export default router;