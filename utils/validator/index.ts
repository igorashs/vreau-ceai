import { ValidationError } from 'joi';
import * as userValidation from './schemas/user';
import * as categoryValidation from './schemas/category';
import * as productValidation from './schemas/product';
import * as orderValidation from './schemas/order';

export const validateUserSignup = (
  user: userValidation.UserSignup,
): Promise<userValidation.UserSignup> =>
  userValidation.signupSchema.validateAsync(user);

export const validateUserLogin = (
  user: userValidation.UserLogin,
): Promise<userValidation.UserLogin> =>
  userValidation.loginSchema.validateAsync(user);

export const validateCategory = (
  category: categoryValidation.Category,
): Promise<categoryValidation.Category> =>
  categoryValidation.categorySchema.validateAsync(category);

export const validateProduct = (
  product: productValidation.Product,
): Promise<productValidation.Product> =>
  productValidation.productSchema.validateAsync(product);

export const validateOrderSubmit = (
  order: orderValidation.OrderSubmit,
): Promise<orderValidation.OrderSubmit> =>
  orderValidation.orderSubmitSchema.validateAsync(order);

export const validateOrderItems = (
  items: Array<orderValidation.OrderItem>,
): Promise<Array<orderValidation.OrderItem>> =>
  orderValidation.orderItemsSchema.validateAsync(items);

export const validateOrderNumber = (
  number: orderValidation.OrderNumber,
): Promise<orderValidation.OrderNumber> =>
  orderValidation.orderNumberSchema.validateAsync(number);

export const validateOrderStatus = (
  status: orderValidation.OrderStatus,
): Promise<orderValidation.OrderStatus> =>
  orderValidation.orderStatusSchema.validateAsync(status);

interface ErrorMessage {
  message: string;
  key: string;
}

export const createValidationError = ({
  message,
  key,
}: ErrorMessage): ValidationError => {
  return new ValidationError(
    message,
    [
      {
        message,
        context: {
          key,
        },
      },
    ],
    null,
  );
};

export const throwValidationError = ({ message, key }: ErrorMessage) => {
  throw createValidationError({ message, key });
};

interface ErrorDetail {
  message: string;
  name?: string;
}

export const getValidationErrorDetails = (
  error: Error,
): Array<ErrorDetail> | null => {
  if (error instanceof ValidationError) {
    return error.details.map((d) => ({
      message: d.message,
      name: d.context?.key,
    }));
  }

  return null;
};

export const validateEmail = (
  email: userValidation.UserEmail,
): Promise<userValidation.UserEmail> =>
  userValidation.emailSchema.validateAsync(email);

export const validateProductName = (
  name: productValidation.ProductName,
): Promise<productValidation.ProductName> =>
  productValidation.nameSchema.validateAsync(name);
