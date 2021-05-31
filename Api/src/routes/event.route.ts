import express, {Router} from 'express';
import eventController from '../controllers/event.controller';
import authorize from '../middlewares/authorize';
// eslint-disable-next-line new-cap
const router: Router = express.Router();

// Create an new event
router.post('/', authorize("admin"), eventController.create);

// Retrieve all events
router.get('/', eventController.findAll);

// Retrieve a single Event with eventId
router.get('/:eventId', eventController.findOne);

// Update an Event with given eventId
router.put('/:eventId', authorize("admin"), eventController.update);

// Delete an Event with given eventId
router.delete('/:eventId', authorize("admin"), eventController.remove);

// Updating event property "isLive" to true
router.put('/startEvent/:eventId', authorize("admin"), eventController.startEvent);

// Updating event property "isLive" to false
router.get('/stopEvent/:eventId', authorize("admin"), eventController.stopEvent);

// Checks if event with given eventId has a route
router.get('/hasRoute/:eventId', eventController.hasRoute);

// Retrieve all events with participant
router.get('/myEvents/findFromUsername', authorize("user"), eventController.findFromUsername);

// Send a message
router.post('/sendMessage/', authorize("admin"), eventController.sendMessage);

export default router;
