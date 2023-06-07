import { ErrorRequestHandler } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ErrorLaunch from '../utils/ErrorLaunch';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  switch (true) {
    case err instanceof ErrorLaunch:
      return res.status(err.code).json({ message: err.message });
    case err instanceof JsonWebTokenError:
      return res.status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Token must be a valid token' });
    default:
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Erro Inesperado!' });
  }
};

export default errorHandler;
