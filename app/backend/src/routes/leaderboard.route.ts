import { Router } from 'express';
import LeaderboardControl from '../controllers/LeaderboardControl';

const router = Router();

const leaderboardControl = new LeaderboardControl();

router.get('/', (req, res) => leaderboardControl.getLeaderboardAllTeams(req, res));
router.get('/home', (req, res) => leaderboardControl.getLeaderboardHomeTeams(req, res));
router.get('/away', (req, res) => leaderboardControl.getLeaderboardAwayTeams(req, res));

export default router;
