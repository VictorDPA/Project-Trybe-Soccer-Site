import * as bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import ErrorLaunch from '../utils/ErrorLaunch';
import User from '../database/models/User';
import UserModel from '../models/UserModel';
import JWT from '../utils/JWT';

export default class UserService {
  constructor(private readonly userModel = new UserModel()) {}

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userModel.login(email);

    if (!user || !(await UserService.verifyUser(user, password))) {
      throw new ErrorLaunch(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    const token = new JWT();
    const loginToken = token.newToken({ email, role: user.role });

    return loginToken;
  }

  private static async verifyUser(user: User, password: string) {
    return bcrypt.compareSync(password, user.password);
  }
}
