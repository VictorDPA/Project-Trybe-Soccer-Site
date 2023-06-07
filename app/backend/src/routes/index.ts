import { Router } from 'express';
import teamRoute from './team.route';
import userRoute from './user.route';
import matchRoute from './match.route';
import leaderboardRoute from './leaderboard.route';

const router = Router();

router.use('/teams', teamRoute);
router.use('/login', userRoute);
router.use('/matches', matchRoute);
router.use('/leaderboard', leaderboardRoute);

export default router;
