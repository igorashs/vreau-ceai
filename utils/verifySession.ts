import * as session from 'lib/session';
import dbConnect from '@/utils/dbConnect';
import { RefreshClaims, SessionAuth, UserAuth } from 'types';
import SessionService from 'services/SessionService';
import UserService from 'services/UserService';

type VerifySessionProps = {
  cookies?: {
    access?: string;
    refresh?: string;
  };

  toUpdate?: boolean;
};

type UserSession = [session: SessionAuth, cookies?: Array<string>];

/**
 * Verify refresh token
 *
 * * Throw Error if refresh token wasn't provided
 * * Throw Error if refresh token is invalid
 * * Throw Error if refresh token doesn't match db token
 *
 * @returns refreshClaims
 */
const verifyRefresh = async (refresh?: string) => {
  if (!refresh) throw new Error('Empty refresh token');
  const refreshClaims = session.verifyToken<RefreshClaims>(refresh);

  if (!refreshClaims) throw new Error('Invalidated refresh token');
  const dbSession = await SessionService.querySession(refreshClaims.user_id);

  if (!dbSession || dbSession.refresh_token !== refresh)
    throw new Error('Invalidated refresh token');

  return refreshClaims;
};

/**
 * Verify access token
 * * Throw Error if access token wasn't provided
 *
 * @returns accessClaims
 */
const verifyAccess = async (access?: string) => {
  if (!access) throw new Error('Empty access token');
  const accessClaims = session.verifyToken<UserAuth>(access);

  return accessClaims;
};

/**
 * Update access token with user information
 *
 * * Throw Error if user is invalid
 *
 * @returns  [{ isAuth: true, user }, [accessCookie]];
 */
const updateAccess = async (
  refreshClaims: RefreshClaims,
): Promise<UserSession> => {
  const dbUser = await UserService.queryUserById(
    refreshClaims.user_id,
    'name isAdmin isManager',
  );

  if (!dbUser) throw new Error('Invalid user');

  const user = {
    _id: dbUser._id,
    name: dbUser.name,
    isAdmin: dbUser.isAdmin,
    isManager: dbUser.isManager,
  };

  const [accessCookie] = session.createAccessCookie(user);

  return [{ isAuth: true, user }, [accessCookie]];
};

/**
 * Verify session (refresh, access)
 *
 * @param cookies - parsed session cookies {access, refresh}
 * @param toUpdate - (force to create a new accessCookie?)
 *
 * @returns SessionAuth and optionally updated access cookie | aged cookies
 */
const verifySession = async ({
  cookies,
  toUpdate = false,
}: VerifySessionProps): Promise<UserSession> => {
  await dbConnect();

  try {
    if (!cookies) throw new Error('No cookies provided');

    const { access, refresh } = cookies;
    const refreshClaims = await verifyRefresh(refresh);

    if (!toUpdate && access) {
      const accessClaims = await verifyAccess(access);

      return [{ isAuth: true, user: accessClaims }];
    }

    const updatedSession = await updateAccess(refreshClaims);

    return updatedSession;
  } catch (error) {
    const agedCookies = session.removeSessionCookies();
    return [{ isAuth: false, user: null }, agedCookies];
  }
};

export default verifySession;
