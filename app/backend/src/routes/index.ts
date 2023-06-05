import { Router } from 'express';
import teamRoute from './team.route';
import userRoute from './user.route';

const router = Router();

router.use('/teams', teamRoute);
router.use('/login', userRoute);

export default router;
