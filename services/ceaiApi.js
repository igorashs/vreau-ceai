const URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (data) => {
  const res = await fetch(`${URL}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();

  return resData;
};

export const signup = async (data) => {
  const res = await fetch(`${URL}/api/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();

  return resData;
};

export const logout = async () => {
  const res = await fetch(`${URL}/api/users/logout`, {
    method: 'POST'
  });

  const resData = await res.json();

  return resData;
};

export const findUser = async (email) => {
  const res = await fetch(`${URL}/api/users?search=${email}`);

  const resData = await res.json();

  return resData;
};

export const updateUserManagerPermission = async (id, isManager) => {
  const res = await fetch(`${URL}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isManager })
  });

  const resData = await res.json();

  return resData;
};

export const refreshUser = async () => {
  const res = await fetch(`${URL}/api/users/refresh`, {
    method: 'POST',
    credentials: 'same-origin'
  });

  const resData = await res.json();

  return resData;
};

export const createCategory = async (data) => {
  const res = await fetch(`${URL}/api/categories`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();

  return resData;
};

export const getCategories = async () => {
  const res = await fetch(`${URL}/api/categories`);

  const resData = await res.json();

  return resData;
};

export const findCategory = async (name) => {
  const res = await fetch(`${URL}/api/categories?search=${name}`);

  const resData = await res.json();

  return resData;
};

export const updateCategory = async (id, data) => {
  const res = await fetch(`${URL}/api/categories/${id}`, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();

  return resData;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${URL}/api/categories/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin'
  });

  const resData = await res.json();

  return resData;
};

export const createProduct = async (data) => {
  const res = await fetch(`${URL}/api/products/create`, {
    method: 'POST',
    credentials: 'same-origin',
    body: data
  });

  const resData = await res.json();

  return resData;
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${URL}/api/products/update/${id}`, {
    method: 'PUT',
    credentials: 'same-origin',
    body: data
  });

  const resData = await res.json();

  return resData;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${URL}/api/products/delete/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin'
  });

  const resData = await res.json();

  return resData;
};

export const findProduct = async (name) => {
  const res = await fetch(`${URL}/api/products?search=${name}`);

  const resData = await res.json();

  return resData;
};

export const getProducts = async (filters, limit = 3, offset = 0) => {
  const res = await fetch(
    `${URL}/api/products${
      filters ? '?filters=' + filters.join(' ') : ''
    }&limit=${limit}&offset=${offset}`
  );

  const resData = await res.json();

  return resData;
};

export const getProductsByCategory = async (
  name,
  filters,
  limit = 3,
  offset = 0
) => {
  const res = await fetch(
    `${URL}/api/products?search=${name}&byCategory=true${
      filters ? '&filters=' + filters.join(' ') : ''
    }&limit=${limit}&offset=${offset}`
  );

  const resData = await res.json();

  return resData;
};

export const createOrder = async (data) => {
  const res = await fetch(`${URL}/api/orders/create`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();

  return resData;
};

export const findOrder = async (number) => {
  const res = await fetch(`${URL}/api/orders?search=${number}`, {
    credentials: 'same-origin'
  });

  const resData = await res.json();

  return resData;
};

export const updateOrder = async (id, data) => {
  const res = await fetch(`${URL}/api/orders/update/${id}`, {
    credentials: 'same-origin',
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();

  return resData;
};

export const deleteOrder = async (id) => {
  const res = await fetch(`${URL}/api/orders/delete/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin'
  });

  const resData = await res.json();

  return resData;
};

export const getOrders = async (filters, limit = 3, offset = 0) => {
  const res = await fetch(
    `${URL}/api/orders${
      filters ? '?filters=' + filters.join(' ') : ''
    }&limit=${limit}&offset=${offset}`,
    { credentials: 'same-origin' }
  );

  const resData = await res.json();

  return resData;
};

export const getUserOrders = async (filters, limit = 3, offset = 0) => {
  const res = await fetch(
    `${URL}/api/orders${
      filters ? '?filters=' + filters.join(' ') : ''
    }&limit=${limit}&offset=${offset}&byUserId=true`,
    { credentials: 'same-origin' }
  );

  const resData = await res.json();

  return resData;
};
