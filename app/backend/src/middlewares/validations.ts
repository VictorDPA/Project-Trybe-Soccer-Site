import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import JWT from '../utils/JWT';
import loginSchema from './joiSchemas';
import { Login, RequestUser } from '../interfaces/UserInterfaces';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const validation = loginSchema({ email, password });

  if (validation && validation.errorCode) {
    return res.status(validation.errorCode).json({ message: validation.errorMessage });
  }

  return next();
};

const validateToken = (
  req: RequestUser,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token not found' });
  }

  const token = new JWT().validateToken<Login>(authorization);
  req.user = token;

  return next();
};

const validateNewMatch = (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam === awayTeam) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ message: 'It is not possible to create a match with two equal teams' });
  }

  return next();
};

export { validateLogin, validateToken, validateNewMatch };
