import { Router } from 'express';
import TeamControl from '../controllers/TeamControl';

const router = Router();

const teamControl = new TeamControl();

router.get('/', (req, res) => teamControl.getAllTeams(req, res));
router.get('/:id', (req, res) => teamControl.getOneTeam(req, res));

export default router;
