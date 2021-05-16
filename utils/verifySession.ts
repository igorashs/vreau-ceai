import * as session from 'lib/session';
import dbConnect from '@/utils/dbConnect';
import { UserAuth } from 'types';
import SessionService from 'services/SessionService';
import UserService from 'services/UserService';

type VerifySessionProps = {
  cookies: {
    access?: string;
    refresh?: string;
  };

  updateAccess?: boolean;
};

type RefreshClaims = {
  user_id: string;
  name: string;
  isAdmin: boolean;
  isManager: boolean;
};

/**
 * @deprecated
 *
 * use SessionAuth type from 'types'
 */
export type SessionAuth = {
  isAuth: boolean;
  user: UserAuth | null;
};

type UserSession = [session: SessionAuth, cookies?: Array<string>];

/**
 *
 * @param cookies - parsed session cookies {access, refresh}
 * @param updateAccess - (force to create a new accessCookie?)
 *
 */
const verifySession = async ({
  cookies: { access, refresh },
  updateAccess = false,
}: VerifySessionProps): Promise<UserSession> => {
  await dbConnect();

  try {
    // todo refactor all this IFS
    if (!refresh) throw new Error('Empty refresh token');

    const refreshClaims = session.verifyToken<RefreshClaims>(refresh);
    if (!refreshClaims) throw new Error('Invalidated refresh token');

    const dbSession = await SessionService.querySession(refreshClaims.user_id);

    if (!dbSession || dbSession.refresh_token !== refresh)
      throw new Error('Invalidated refresh token');

    if (!updateAccess && access) {
      const accessClaims = session.verifyToken<UserAuth>(access);

      if (accessClaims) return [{ isAuth: true, user: accessClaims }];
    }

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

    const [accessCookie] = session.createAccessSession(user);

    return [{ isAuth: true, user }, [accessCookie]];
  } catch (error) {
    const cookies = session.removeSession();
    return [{ isAuth: false, user: null }, cookies];
  }
};

export default verifySession;
