import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';
import { RequestUser, Login } from '../interfaces/UserInterfaces';

export default class UserControl {
  constructor(private userService = new UserService()) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const itoken = await this.userService.login({ email, password });
    return res.status(StatusCodes.OK).json({ token: itoken });
  }

  static async userRole(req: RequestUser, res: Response) {
    const { role } = req.user as Login;
    res.status(StatusCodes.OK).json({ role });
  }
}
