import FormidableLib from 'formidable';
import { ValidationError } from 'joi';

export type Product = {
  _id: string;
  name: string;
  category_id: string;
  src: string;
  price: number;
  quantity: number;
  total_quantity: number;
  description: string;
  recommend: boolean;
};

export type ProductWithCategory = Product & {
  category_id: { name: string };
};

export type ErrorDetail = {
  message: string;
  name?: string;
};

export type ProductName = {
  name: string;
};

export type ProductNameErrorDetail = ErrorDetail & {
  name?: keyof ProductName;
};

export type ProductFields = ProductName & {
  src?: string;
  price: number;
  quantity: number;
  total_quantity: number;
  description: string;
  recommend: boolean;
  category_id: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type ProductErrorDetail = ErrorDetail & {
  name?: keyof ProductFields;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  errors?: ErrorDetail[];
};

export type User = {
  _id: string;
  name: string;
  email: string;
  isManager: boolean;
};

export type UserEmail = {
  email: string;
};

export type UserEmailErrorDetail = ErrorDetail & {
  name?: keyof UserEmail;
};

export type UserLogin = UserEmail & { password: string };

export type UserSignup = UserEmail & {
  name: string;
  password: string;
  repeat_password: string;
};

export type UserPermissions = { isManager: boolean };

export type LabelMessage = { success: boolean; message: string };

export type UserAuth = {
  _id: string;
  name: string;
  isAdmin: boolean;
  isManager: boolean;
};

export type UserSession = {
  isAuth: boolean;
  user: UserAuth | null;
  needRefresh: boolean;
};

type dataType = 'data' | 'error' | 'field' | 'fileBegin' | 'file' | 'progress';

export declare class Formidable extends FormidableLib {
  emit(name: dataType, data: FormidableLib.EmitData | ValidationError): void;
}

export type CategoryName = {
  name: string;
};

export type CategoryNameErrorDetail = ErrorDetail & {
  name?: keyof CategoryName;
};

export type OrderSubmit = {
  tel: string;
  address: string;
};

export type OrderItem = {
  product_id: string;
  count: number;
};

export type OrderStatus = {
  status: 'processing' | 'inDelivery' | 'canceled' | 'completed';
};

export type OrderStatusErrorDetail = ErrorDetail & {
  name?: keyof OrderStatus;
};

export type OrderNumber = {
  number: string;
};

export type OrderNumberErrorDetail = ErrorDetail & {
  name?: keyof OrderNumber;
};

export type OrderFields = {
  info: OrderSubmit;
  items: OrderItem[];
};

export type Order = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  number: string;
  total_price: number;
  status: 'processing' | 'inDelivery' | 'canceled' | 'completed';
  items: {
    count: number;
    product: { name: string; price: number; quantity: number };
  }[];
  address: string;
  tel: string;
  orderedAt: Date;
  completedAt: Date;
};

export type UserOrders = { orders: Order[]; count: number };

export type ManagementOrders = { orders: Order[]; count: number };
