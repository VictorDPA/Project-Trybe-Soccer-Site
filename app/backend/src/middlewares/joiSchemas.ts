import { StatusCodes } from 'http-status-codes';
import * as Joi from 'joi';
import { ValidationError } from 'joi';

interface Login {
  email: string;
  password: string;
}

const errorTypes = ({ details }: ValidationError) => {
  const joiError = details?.[0];
  const errorMessage = joiError?.message;
  let errorCode = StatusCodes.INTERNAL_SERVER_ERROR;

  switch (joiError?.type) {
    case 'string.min':
    case 'string.email':
      errorCode = StatusCodes.UNAUTHORIZED;
      break;
    case 'any.required':
    case 'string.empty':
      errorCode = StatusCodes.BAD_REQUEST;
      break;
    default:
      errorCode = StatusCodes.INTERNAL_SERVER_ERROR;
      break;
  }
  return { errorCode, errorMessage };
};

const loginSchema = (login: Login) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).messages({
    'string.min': 'Invalid email or password',
    'string.email': 'Invalid email or password',
    'string.empty': 'All fields must be filled',
    'any.required': 'All fields must be filled',
  });

  const { error } = schema.validate(login);

  if (error) {
    const { errorCode, errorMessage } = errorTypes(error);
    return { errorCode, errorMessage };
  }
  return null;
};
export default loginSchema;
