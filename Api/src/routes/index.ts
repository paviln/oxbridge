import express, {Router} from 'express';
import eventRoutes from './event.route';
import eventRegistrationRoutes from './eventRegistration.route';
import locationRegistrationRoutes from './locationRegistration.route';
import pointRoutes from './locationRegistration.route';
import shipRoutes from './ship.route';
import userRoutes from './user.route';

// eslint-disable-next-line new-cap
const router: Router = express.Router();

router.use('/events', eventRoutes);
router.use('/eventRegistrations', eventRegistrationRoutes);
router.use('/locationRegistrations', locationRegistrationRoutes);
router.use('/racePoints', pointRoutes);
router.use('/ships', shipRoutes);
router.use('/users', userRoutes);

export default router;
