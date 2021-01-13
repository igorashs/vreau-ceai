import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const EXPIRE_TIME = 24 * 60 * 60;

export const createSession = (payload) => {
  const token = jwt.sign(payload, process.env.AUTH_PRIVATE_KEY, {
    expiresIn: EXPIRE_TIME
  });

  const [header, jwtPayload, signature] = token.split('.');
  const session = header + '.' + jwtPayload;

  const sessionCookie = cookie.serialize('session', session, {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: EXPIRE_TIME
  });

  const authCookie = cookie.serialize('auth', signature, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: EXPIRE_TIME
  });

  return [sessionCookie, authCookie];
};
