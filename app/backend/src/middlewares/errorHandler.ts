import { ErrorRequestHandler } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ErrorLaunch from '../utils/ErrorLaunch';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ErrorLaunch) {
    return res.status(err.code).json({ message: err.message });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Token must be a valid token' });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Erro Inesperado!' });
};

export default errorHandler;
