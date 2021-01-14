import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const EXPIRE_TIME = 24 * 60 * 60;

/**
 * Creates session and auth cookies from jwt
 *
 * Token splitted in two cookies:
 *
 * session - header and payload
 *
 * auth - signature (httpOnly)
 *
 * @param payload The data to be signed in the token (sessionCookie)
 *
 * @returns serialized cookies [sessionCookie, authCookie]
 */
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

/**
 * Removes session and auth cookie
 *
 * @returns aged cookies [sessionCookie, authCookie]
 */
export const removeSession = () => {
  const sessionCookie = cookie.serialize('session', '', {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  const authCookie = cookie.serialize('auth', '', {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  return [sessionCookie, authCookie];
};

/**
 * Verify jwt | session + auth
 *
 * @param req Next Api Request
 *
 * @returns session payload or null
 */
export const verifySession = (req) => {
  try {
    const cookies = cookie.parse((req && req.headers.cookie) || '');

    const session = jwt.verify(
      cookies.session + '.' + cookies.auth,
      process.env.AUTH_PRIVATE_KEY
    );

    return session;
  } catch (error) {
    return null;
  }
};
