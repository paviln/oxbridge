import express, {Router} from 'express';
import eventRoutes from './event.route';
import registrationRoutes from './registration.route';
import locationRoutes from './location.route';
import pointRoutes from './point.route';
import teamRoutes from './team.route';
import userRoutes from './user.route';

// eslint-disable-next-line new-cap
const router: Router = express.Router();

router.use('/event', eventRoutes);
router.use('/registration', registrationRoutes);
router.use('/location', locationRoutes);
router.use('/point', pointRoutes);
router.use('/team', teamRoutes);
router.use('/user', userRoutes);

export default router;
