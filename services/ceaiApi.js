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

export const logout = async () => {};
