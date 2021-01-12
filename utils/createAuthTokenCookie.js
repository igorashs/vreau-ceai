import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const EXPIRE_TIME = 24 * 60 * 60;

export const createAuthTokenCookie = (payload) => {
  const authToken = jwt.sign(payload, process.env.AUTH_PRIVATE_KEY, {
    expiresIn: EXPIRE_TIME
  });

  return cookie.serialize('auth-token', authToken, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: EXPIRE_TIME
  });
};
