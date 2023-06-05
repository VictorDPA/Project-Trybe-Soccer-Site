import { Router } from 'express';
import teamRoute from './team.route';

const router = Router();

router.use('/teams', teamRoute);

export default router;
