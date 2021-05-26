import express, {Router} from 'express';
import authorize from '../middlewares/authorize';
import eventController from '../controllers/event.controller';

// eslint-disable-next-line new-cap
const router: Router = express.Router();

// Create an new event
router.post('/', authorize, eventController.create);

// Retrieve all events
router.get('/', eventController.findAll);

// Retrieve a single Event with eventId
router.get('/:eventId', eventController.findOne);

// Update an Event with given eventId
router.put('/:eventId', authorize, eventController.update);

// Delete an Event with given eventId
router.delete('/:eventId', authorize, eventController.remove);

// Updating event property "isLive" to true
router.put('/startEvent/:eventId',
    authorize, eventController.startEvent);

// Updating event property "isLive" to false
router.get('/stopEvent/:eventId', authorize, eventController.stopEvent);

// Checks if event with given eventId has a route
router.get('/hasRoute/:eventId', authorize, eventController.hasRoute);

// Retrieve all events with participant
router.get('/myEvents/findFromUsername',
    authorize, eventController.findFromUsername);

export default router;
