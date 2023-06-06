import { Router } from 'express';
import { validateNewMatch, validateToken } from '../middlewares/validations';
import MatchControl from '../controllers/MatchControl';

const router = Router();

const matchControl = new MatchControl();

router.get('/', (req, res) => matchControl.getAllMatches(req, res));
router.patch('/:id/finish', validateToken, (req, res) => matchControl.endMatch(req, res));
router.patch('/:id', validateToken, (req, res) => matchControl.updateMatch(req, res));
router.post(
  '/',
  validateToken,
  validateNewMatch,
  (req, res) => matchControl.createMatch(req, res),
);

export default router;
