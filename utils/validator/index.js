import {
  userSignupSchema,
  userAlreadyExistsDescription,
  unauthorizedUserEmailDescription,
  unauthorizedUserPasswordDescription,
  userLoginSchema
} from './schemas/user';
import { ValidationError } from 'joi';

export const validateUserSignup = (user) =>
  userSignupSchema.validateAsync(user);

export const validateUserLogin = (user) => userLoginSchema.validateAsync(user);

export const throwUserAlreadyExists = () =>
  throwValidationError(userAlreadyExistsDescription);

export const throwUnauthorizedUserEmail = () =>
  throwValidationError(unauthorizedUserEmailDescription);

export const throwUnauthorizedUserPassword = () =>
  throwValidationError(unauthorizedUserPasswordDescription);

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
