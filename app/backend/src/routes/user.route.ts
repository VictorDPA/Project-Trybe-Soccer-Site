import { Router } from 'express';
import UserControl from '../controllers/UserControl';
import { validateLogin } from '../middlewares/validations';

const router = Router();

const userControl = new UserControl();

router.post('/', validateLogin, (req, res) => userControl.login(req, res));

export default router;
