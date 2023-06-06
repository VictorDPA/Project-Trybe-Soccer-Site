import * as jwt from 'jsonwebtoken';

export default class JWT {
  constructor(
    private secret = process.env.JWT_SECRET || 'secret',
    private config: jwt.SignOptions = {
      expiresIn: '2d',
      algorithm: 'HS256',
    },
  ) {}

  newToken = (payload: object) => jwt.sign(payload, this.secret, this.config);

  validateToken = <Type>(token: string) => jwt.verify(token, this.secret) as Type;
}
