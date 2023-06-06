import { Router } from 'express';
import UserControl from '../controllers/UserControl';
import { validateLogin, validateToken } from '../middlewares/validations';

const router = Router();

const userControl = new UserControl();

router.post('/', validateLogin, (req, res) => userControl.login(req, res));
router.get('/role', validateToken, (req, res) => UserControl.userRole(req, res));

export default router;
