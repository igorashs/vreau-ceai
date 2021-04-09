import { ValidationError } from 'joi';
import {
  CategoryName,
  ErrorDetail,
  ProductFields,
  ProductName,
  UserEmail,
  UserLogin,
  UserSignup,
} from 'types';
import * as userValidation from './schemas/user';
import * as categoryValidation from './schemas/category';
import * as productValidation from './schemas/product';
import * as orderValidation from './schemas/order';

interface Fields {
  [key: string]: string | string[];
}

export const validateUserSignup = (user: UserSignup): Promise<UserSignup> =>
  userValidation.signupSchema.validateAsync(user);

export const validateUserLogin = (user: UserLogin): Promise<UserLogin> =>
  userValidation.loginSchema.validateAsync(user);

export const validateCategory = (
  category: CategoryName,
): Promise<CategoryName> =>
  categoryValidation.categorySchema.validateAsync(category);

export const validateProduct = (
  product: ProductFields | Fields,
): Promise<ProductFields> =>
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

export const getValidationErrorDetails = (
  error: Error,
): ErrorDetail[] | null => {
  if (error instanceof ValidationError) {
    return error.details.map((d) => ({
      message: d.message,
      name: d.context?.key,
    }));
  }

  return null;
};

export const validateEmail = (email: UserEmail): Promise<UserEmail> =>
  userValidation.emailSchema.validateAsync(email);

export const validateProductName = (name: ProductName): Promise<ProductName> =>
  productValidation.nameSchema.validateAsync(name);
