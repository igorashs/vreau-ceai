import {
  Category,
  ApiResponse,
  Product,
  UserLogin,
  UserSignup,
  UserEmail,
  User,
  UserPermissions,
  OrderFields,
  UserOrders,
  ProductWithCategory,
  ProductErrorDetail,
  ProductName,
  ManagementOrders,
  OrderStatus,
  Order,
  OrderStatusErrorDetail,
  OrderNumber,
  OrderNumberErrorDetail,
  UserEmailErrorDetail,
  ProductNameErrorDetail,
  CategoryName,
  CategoryNameErrorDetail,
  SessionAuth,
} from 'types';

const URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async <P extends UserLogin, R extends ApiResponse>(
  data: P,
): Promise<R> => {
  const res = await fetch(`${URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const signup = async <P extends UserSignup, R extends ApiResponse>(
  data: P,
) => {
  const res = await fetch(`${URL}/api/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const logout = async <R extends ApiResponse>() => {
  const res = await fetch(`${URL}/api/users/logout`, {
    method: 'POST',
  });

  return res.json() as Promise<R>;
};

export const findUser = async <
  P extends UserEmail,
  R extends ApiResponse & { user: User; errors?: UserEmailErrorDetail[] }
>({
  email,
}: P) => {
  const res = await fetch(`${URL}/api/users?search=${email}`);

  return res.json() as Promise<R>;
};

export const updateUserManagerPermission = async <
  P extends UserPermissions,
  R extends ApiResponse & { user: User }
>(
  id: string,
  data: P,
) => {
  const res = await fetch(`${URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const refreshUser = async <
  R extends ApiResponse & { session: SessionAuth }
>() => {
  const res = await fetch(`${URL}/api/users/refresh`, {
    method: 'POST',
    credentials: 'same-origin',
  });

  return res.json() as Promise<R>;
};

export const createCategory = async <
  P extends CategoryName,
  R extends ApiResponse & {
    category: Category;
    errors?: CategoryNameErrorDetail[];
  }
>(
  data: P,
) => {
  const res = await fetch(`${URL}/api/categories`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const getCategories = async <
  R extends ApiResponse & { categories: Category[] }
>() => {
  const res = await fetch(`${URL}/api/categories`);

  return res.json() as Promise<R>;
};

export const findCategory = async <
  P extends CategoryName,
  R extends ApiResponse & {
    category: Category;
    errors?: CategoryNameErrorDetail[];
  }
>({
  name,
}: P) => {
  const res = await fetch(`${URL}/api/categories?search=${name}`);

  return res.json() as Promise<R>;
};

export const updateCategory = async <
  P extends CategoryName,
  R extends ApiResponse & {
    category: Category;
    errors?: CategoryNameErrorDetail[];
  }
>(
  id: string,
  data: P,
) => {
  const res = await fetch(`${URL}/api/categories/${id}`, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const deleteCategory = async <R extends ApiResponse>(id: string) => {
  const res = await fetch(`${URL}/api/categories/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  });

  return res.json() as Promise<R>;
};

export const createProduct = async <
  R extends ApiResponse & { product: Product; errors?: ProductErrorDetail[] }
>(
  data: FormData,
) => {
  const res = await fetch(`${URL}/api/products/create`, {
    method: 'POST',
    credentials: 'same-origin',
    body: data,
  });

  return res.json() as Promise<R>;
};

export const updateProduct = async <
  R extends ApiResponse & { product: Product; errors?: ProductErrorDetail[] }
>(
  id: string,
  data: FormData,
) => {
  const res = await fetch(`${URL}/api/products/update/${id}`, {
    method: 'PUT',
    credentials: 'same-origin',
    body: data,
  });

  return res.json() as Promise<R>;
};

export const deleteProduct = async <R extends ApiResponse>(id: string) => {
  const res = await fetch(`${URL}/api/products/delete/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  });

  return res.json() as Promise<R>;
};

export const findProduct = async <
  R extends ApiResponse & {
    product: Product;
    errors?: ProductNameErrorDetail[];
  }
>({
  name,
}: ProductName) => {
  const res = await fetch(`${URL}/api/products?search=${name}`);

  return res.json() as Promise<R>;
};

export const getProducts = async <
  P extends string[] | null,
  R extends ApiResponse & { products: Product[]; count: number }
>(
  filters: P,
  limit = 3,
  offset = 0,
) => {
  const res = await fetch(
    `${URL}/api/products${
      filters ? `?filters=${filters.join(' ')}` : ''
    }&limit=${limit}&offset=${offset}`,
  );

  return res.json() as Promise<R>;
};

export const getProductsByCategory = async <
  P extends string[] | null,
  R extends ApiResponse & { products: Product[]; count: number }
>(
  name: string,
  filters: P,
  limit = 3,
  offset = 0,
) => {
  const res = await fetch(
    `${URL}/api/products?search=${name}&byCategory=true${
      filters ? `&filters=${filters.join(' ')}` : ''
    }&limit=${limit}&offset=${offset}`,
  );

  return res.json() as Promise<R>;
};

export const createOrder = async <
  P extends OrderFields,
  R extends ApiResponse & { number: string }
>(
  data: P,
) => {
  const res = await fetch(`${URL}/api/orders/create`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const findOrder = async <
  R extends ApiResponse & { order: Order; errors?: OrderNumberErrorDetail[] }
>({
  number,
}: OrderNumber) => {
  const res = await fetch(`${URL}/api/orders?search=${number}`, {
    credentials: 'same-origin',
  });

  return res.json() as Promise<R>;
};

export const updateOrder = async <
  P extends OrderStatus,
  R extends ApiResponse & { order: Order; errors?: OrderStatusErrorDetail[] }
>(
  id: string,
  data: P,
) => {
  const res = await fetch(`${URL}/api/orders/update/${id}`, {
    credentials: 'same-origin',
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<R>;
};

export const deleteOrder = async <R extends ApiResponse>(id: string) => {
  const res = await fetch(`${URL}/api/orders/delete/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  });

  return res.json() as Promise<R>;
};

export const getOrders = async <
  P extends string[] | null,
  R extends ApiResponse & ManagementOrders
>(
  filters: P,
  limit = 3,
  offset = 0,
) => {
  const res = await fetch(
    `${URL}/api/orders${
      filters ? `?filters=${filters.join(' ')}` : ''
    }&limit=${limit}&offset=${offset}`,
    { credentials: 'same-origin' },
  );

  return res.json() as Promise<R>;
};

export const getUserOrders = async <
  P extends string[] | null,
  R extends ApiResponse & UserOrders
>(
  filters: P,
  limit = 3,
  offset = 0,
) => {
  const res = await fetch(
    `${URL}/api/orders${
      filters ? `?filters=${filters.join(' ')}` : ''
    }&limit=${limit}&offset=${offset}&byUserId=true`,
    { credentials: 'same-origin' },
  );

  return res.json() as Promise<R>;
};

export const getRecommendedProducts = async <
  R extends ApiResponse & { products: ProductWithCategory[] }
>(
  limit = 3,
  offset = 0,
) => {
  const res = await fetch(
    `${URL}/api/products?recommended=true&limit=${limit}&offset=${offset}`,
  );

  return res.json() as Promise<R>;
};
