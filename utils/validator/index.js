import * as userValidation from './schemas/user';
import * as categoryValidation from './schemas/category';
import * as productValidation from './schemas/product';
import { ValidationError } from 'joi';

export const validateUserSignup = (user) =>
  userValidation.signupSchema.validateAsync(user);

export const validateUserLogin = (user) =>
  userValidation.loginSchema.validateAsync(user);

export const validateCategory = (category) =>
  categoryValidation.categorySchema.validateAsync(category);

export const validateProduct = (product) =>
  productValidation.productSchema.validateAsync(product);

export const createValidationError = ({ message, key }) => {
  return new ValidationError(message, [
    {
      message,
      context: {
        key
      }
    }
  ]);
};

export const throwValidationError = ({ message, key }) => {
  throw createValidationError({ message, key });
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
