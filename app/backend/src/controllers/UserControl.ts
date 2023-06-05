import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../services/UserService';

export default class UserControl {
  constructor(private userService = new UserService()) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const token = await this.userService.login({ email, password });
    return res.status(StatusCodes.OK).json(token);
  }
}