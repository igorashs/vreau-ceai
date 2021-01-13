import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export const getSession = (req = null) => {
  const cookies = cookie.parse(
    req ? req.headers.cookie || '' : document.cookie
  );

  try {
    const session = jwt.decode(cookies?.session + '.');

    return session;
  } catch (error) {
    return null;
  }
};
