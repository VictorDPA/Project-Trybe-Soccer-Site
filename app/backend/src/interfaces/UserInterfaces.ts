import { Request } from 'express';

interface Login {
  role: string;
  email: string;
}

interface RequestUser extends Request {
  user?: Login;
}

export { Login, RequestUser };
