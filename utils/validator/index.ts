import { ValidationError } from 'joi';
import {
  CategoryName,
  ErrorDetail,
  OrderItem,
  OrderNumber,
  OrderStatus,
  OrderSubmit,
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

export const validateUserSignup = (user: UserSignup): Promise<UserSignup> =>
  userValidation.signupSchema.validateAsync(user);

export const validateUserLogin = (user: UserLogin): Promise<UserLogin> =>
  userValidation.loginSchema.validateAsync(user);

export const validateCategory = (
  category: CategoryName,
): Promise<CategoryName> =>
  categoryValidation.categorySchema.validateAsync(category);

export const validateProduct = (
  product: Partial<ProductFields>,
): Promise<ProductFields> =>
  productValidation.productSchema.validateAsync(product);

export const validateOrderSubmit = (order: OrderSubmit): Promise<OrderSubmit> =>
  orderValidation.orderSubmitSchema.validateAsync(order);

export const validateOrderItems = (
  items: Array<OrderItem>,
): Promise<Array<OrderItem>> =>
  orderValidation.orderItemsSchema.validateAsync(items);

export const validateOrderNumber = (
  number: OrderNumber,
): Promise<OrderNumber> =>
  orderValidation.orderNumberSchema.validateAsync(number);

export const validateOrderStatus = (
  status: OrderStatus,
): Promise<OrderStatus> =>
  orderValidation.orderStatusSchema.validateAsync(status);

type ErrorMessage = {
  message: string;
  key: string;
};

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

export const validateProductName = (
  name: Partial<ProductName>,
): Promise<ProductName> => productValidation.nameSchema.validateAsync(name);
