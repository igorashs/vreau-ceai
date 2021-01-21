import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const EXPIRE_TIME = 24 * 60 * 60;
const ACCESS_TIME = 300;

export const createToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.AUTH_TOKEN_SECRET, {
    expiresIn
  });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const createCookie = (name, value, maxAge) =>
  cookie.serialize(name, value, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge
  });

export const removeCookie = (c) =>
  cookie.serialize(c, '', {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

export const createAccessSession = (payload) => {
  const accessToken = createToken(payload, ACCESS_TIME);
  const accessCookie = createCookie('access', accessToken, ACCESS_TIME);

  return [accessCookie, accessToken];
};

export const createRefreshSession = (payload) => {
  const refreshToken = createToken(payload, EXPIRE_TIME);
  const refreshCookie = createCookie('refresh', refreshToken, EXPIRE_TIME);

  return [refreshCookie, refreshToken];
};

/**
 *
 * @param payload The data to be signed
 *
 * @returns serialized cookies and refresh token
 * {[accessCookie, refreshCookie], refreshToken}
 */
export const createSession = (accessClaims, refreshClaims) => {
  const [accessCookie] = createAccessSession(accessClaims);
  const [refreshCookie, refreshToken] = createRefreshSession(refreshClaims);

  return { cookies: [accessCookie, refreshCookie], refreshToken };
};

/**
 *
 * @returns aged cookies [accessCookie, refreshCookie]
 *
 */
export const removeSession = () => {
  const accessCookie = removeCookie('access');
  const refreshCookie = removeCookie('refresh');

  return [accessCookie, refreshCookie];
};
