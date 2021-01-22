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
    method: 'POST',
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

export const deleteCategory = async (id) => {
  const res = await fetch(`${URL}/api/categories/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin'
  });

  const resData = await res.json();

  return resData;
};
