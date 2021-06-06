import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const EXPIRE_TIME = 24 * 60 * 60;
const ACCESS_TIME = 300;

type Payload = string | object | Buffer;

/**
 * Create jwt with given payload
 * @returns jwt
 */
export const createToken = <T extends Payload>(payload: T, expiresIn: number) =>
  jwt.sign(payload, process.env.AUTH_TOKEN_SECRET as string, {
    expiresIn,
  });

/**
 * Verify jwt with `AUTH_TOKEN_SECRET` key
 *
 * @returns decoded token | null
 */
export const verifyToken = <T extends object>(token?: string): T | null => {
  try {
    return jwt.verify(
      token || '',
      process.env.AUTH_TOKEN_SECRET as string,
    ) as T;
  } catch (error) {
    return null;
  }
};

/**
 * Serialize cookie
 *
 * @returns serialized cookie
 */
export const createCookie = (name: string, value: string, maxAge: number) =>
  cookie.serialize(name, value, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge,
  });

/**
 * Remove cookie
 *
 * @returns serialized aged cookie
 */
export const removeCookie = (name: string) =>
  cookie.serialize(name, '', {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

/**
 * Create access cookie with jwt
 *
 * @returns [accessCookie, accessToken]
 */
export const createAccessCookie = <T extends Payload>(
  payload: T,
): [accessCookie: string, accessToken: string] => {
  const accessToken = createToken<T>(payload, ACCESS_TIME);
  const accessCookie = createCookie('access', accessToken, ACCESS_TIME);

  return [accessCookie, accessToken];
};

/**
 * Create refresh cookie with jwt
 *
 * @returns [refreshCookie, refreshToken]
 */
export const createRefreshCookie = <T extends Payload>(
  payload: T,
): [refreshCookie: string, refreshToken: string] => {
  const refreshToken = createToken<T>(payload, EXPIRE_TIME);
  const refreshCookie = createCookie('refresh', refreshToken, EXPIRE_TIME);

  return [refreshCookie, refreshToken];
};

/**
 * Create session Cookies
 *
 * @param accessClaims  The data to be signed and provided to access cookie
 * @param refreshClaims The data to be signed and provided to refresh cookie
 *
 * @returns sessionCookies & refreshToken
 */
export const createSessionCookies = <T extends Payload, E extends Payload>(
  accessClaims: T,
  refreshClaims: E,
): {
  cookies: [accessCookie: string, refreshCookie: string];
  refreshToken: string;
} => {
  const [accessCookie] = createAccessCookie<T>(accessClaims);
  const [refreshCookie, refreshToken] = createRefreshCookie<E>(refreshClaims);

  return { cookies: [accessCookie, refreshCookie], refreshToken };
};

/**
 *  Remove session cookies
 *
 * @returns aged cookies [accessCookie, refreshCookie]
 */
export const removeSessionCookies = (): [
  accessCookie: string,
  refreshCookie: string,
] => {
  const accessCookie = removeCookie('access');
  const refreshCookie = removeCookie('refresh');

  return [accessCookie, refreshCookie];
};

/**
 * Verify refresh & access tokens
 *
 * @returns \{isAuth: boolean; claims: T}
 */
export const validateSession = <T extends object>(
  access?: string,
  refresh?: string,
) => {
  const refreshClaims = verifyToken(refresh);

  if (!refreshClaims) return { isAuth: false, claims: null };

  const claims = verifyToken<T>(access);

  return { isAuth: true, claims };
};
