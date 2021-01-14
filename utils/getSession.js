import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export const getSession = (req) => {
  try {
    const cookies = cookie.parse((req && req.headers.cookie) || '');
    const session = jwt.decode(cookies?.session + '.');

    return session;
  } catch (error) {
    return null;
  }
};
