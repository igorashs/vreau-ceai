import * as userValidation from './schemas/user';
import { ValidationError } from 'joi';

export const validateUserSignup = (user) =>
  userValidation.signupSchema.validateAsync(user);

export const validateUserLogin = (user) =>
  userValidation.loginSchema.validateAsync(user);

export const throwUserAlreadyExists = () =>
  throwValidationError(userValidation.alreadyExistsDescription);

export const throwUnauthorizedUserEmail = () =>
  throwValidationError(userValidation.unauthorizedEmailDescription);

export const throwUnauthorizedUserPassword = () =>
  throwValidationError(userValidation.unauthorizedPasswordDescription);

export const throwValidationError = ({ message, key }) => {
  throw new ValidationError(message, [
    {
      message,
      context: {
        key
      }
    }
  ]);
};

export const getValidationErrorDetails = (error) => {
  if (error instanceof ValidationError) {
    return error.details.map((d) => ({
      message: d.message,
      name: d.context.key
    }));
  }

  return null;
};

export const validateEmail = (email) =>
  userValidation.emailSchema.validateAsync(email);
