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

export type ProductName = {
  name: string;
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
  products: Product[];
};

export type ErrorDetail = {
  message: string;
  name?: string;
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

export type OrderNumber = {
  number: string;
};

export type OrderFields = {
  info: OrderSubmit;
  items: OrderItem[];
};

export type Order = {
  _id: string;
  user: string;
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
