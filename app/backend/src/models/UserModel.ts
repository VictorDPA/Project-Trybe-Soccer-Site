import User from '../database/models/User';

export default class UserModel {
  constructor(private model = User) {}

  login(email: string) {
    const findEmail = this.model.findOne({ where: { email } });
    return findEmail;
  }
}
