import FormidableLib from 'formidable';
import { ValidationError } from 'joi';

export type Product = {
  _id: string;
  name: string;
  category_id: { name: string };
  src: string;
  price: number;
  quantity: number;
  total_quantity: number;
  description: string;
  recommend: boolean;
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

type dataType = 'data' | 'error' | 'field' | 'fileBegin' | 'file' | 'progress';

export declare class Formidable extends FormidableLib {
  emit(name: dataType, data: FormidableLib.EmitData | ValidationError): void;
}

export type CategoryName = {
  name: string;
};
