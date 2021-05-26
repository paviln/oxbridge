import express, {Router} from 'express';
import eventRoutes from './event.route';
import locationRoutes from './location.route';
import pointRoutes from './point.route';
import teamRoutes from './team.route';
import userRoutes from './user.route';

// eslint-disable-next-line new-cap
const router: Router = express.Router();

router.use('/events', eventRoutes);
router.use('/locationRegistrations', locationRoutes);
router.use('/racePoints', pointRoutes);
router.use('/ships', teamRoutes);
router.use('/users', userRoutes);

export default router;
