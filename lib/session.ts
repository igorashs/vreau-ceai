import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const EXPIRE_TIME = 24 * 60 * 60;
const ACCESS_TIME = 300;

type Payload = string | object | Buffer;

export const createToken = <T extends Payload>(payload: T, expiresIn: number) =>
  jwt.sign(payload, process.env.AUTH_TOKEN_SECRET as string, {
    expiresIn,
  });

export const verifyToken = <T extends object>(token: string): T | null => {
  try {
    return jwt.verify(token, process.env.AUTH_TOKEN_SECRET as string) as T;
  } catch (error) {
    return null;
  }
};

export const createCookie = (name: string, value: string, maxAge: number) =>
  cookie.serialize(name, value, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge,
  });

export const removeCookie = (name: string) =>
  cookie.serialize(name, '', {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

export const createAccessSession = <T extends Payload>(
  payload: T,
): [accessCookie: string, accessToken: string] => {
  const accessToken = createToken<T>(payload, ACCESS_TIME);
  const accessCookie = createCookie('access', accessToken, ACCESS_TIME);

  return [accessCookie, accessToken];
};

export const createRefreshSession = <T extends Payload>(
  payload: T,
): [refreshCookie: string, refreshToken: string] => {
  const refreshToken = createToken<T>(payload, EXPIRE_TIME);
  const refreshCookie = createCookie('refresh', refreshToken, EXPIRE_TIME);

  return [refreshCookie, refreshToken];
};

/**
 *
 * @param accessClaims  The data to be signed to access token
 * @param refreshClaims The data to be signed to refresh token
 *
 */
export const createSession = <T extends Payload, E extends Payload>(
  accessClaims: T,
  refreshClaims: E,
): {
  cookies: [accessCookie: string, refreshCookie: string];
  refreshToken: string;
} => {
  const [accessCookie] = createAccessSession<T>(accessClaims);
  const [refreshCookie, refreshToken] = createRefreshSession<E>(refreshClaims);

  return { cookies: [accessCookie, refreshCookie], refreshToken };
};

/**
 *
 * @returns aged cookies [accessCookie, refreshCookie]
 *
 */
export const removeSession = (): [
  accessCookie: string,
  refreshCookie: string,
] => {
  const accessCookie = removeCookie('access');
  const refreshCookie = removeCookie('refresh');

  return [accessCookie, refreshCookie];
};
