import { StatusCodes } from 'http-status-codes';
import * as Joi from 'joi';

interface Login {
  email: string;
  password: string;
}
const typesErrors: { [key: string]: number } = {
  'string.empty': StatusCodes.BAD_REQUEST,
  'any.required': StatusCodes.BAD_REQUEST,
  'string.email': StatusCodes.UNAUTHORIZED,
  'string.min': StatusCodes.UNAUTHORIZED,
};

const readError = (type: string) => typesErrors[type];

const loginSchema = (login: Login) =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).messages({
    'string.min': 'Invalid email or password',
    'string.email': 'Invalid email or password',
    'string.empty': 'All fields must be filled',
    'any.required': 'All fields must be filled',
  }).unknown(false).validate(login);

export { loginSchema, readError };
