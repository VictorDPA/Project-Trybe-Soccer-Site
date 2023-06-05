import { Request, Response, NextFunction } from 'express';
import { loginSchema } from './joiSchemas';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const validation = loginSchema({ email, password });

  if (validation && validation.errorCode) {
    return res.status(validation.errorCode).json({ message: validation.errorMessage });
  }

  return next();
};

const validateSomething = (_req: Request, _res: Response, _next: NextFunction) => {
  // ...
};

export { validateLogin, validateSomething };
