import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import { RequestUser, Login } from '../interfaces/UserInterfaces';

export default class UserControl {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.userService.login({ email, password });
    return res.status(StatusCodes.OK).json({ token });
  };

  static userRole = async (req: RequestUser, res: Response) => {
    const { role } = req.user as Login;
    return res.status(StatusCodes.OK).json({ role });
  };
}
