import * as session from 'lib/session';
import dbConnect from '@/utils/dbConnect';
import User from 'models/User';
import Token from 'models/Token';

/**
 *
 * @param cookies - parsed session cookies {access, refresh}
 * @param updateAccess - (force to create a new accessCookie?)
 *
 * @returns [session, cookies?]
 */
export const verifySession = async ({ access, refresh }, updateAccess) => {
  await dbConnect();

  try {
    if (!refresh) throw new Error('Empty refresh token');

    const refreshClaims = session.verifyToken(refresh);
    if (!refreshClaims) throw new Error('Invalidated refresh token');

    const token = await Token.findOne({ user_id: refreshClaims.user_id });
    if (!token) throw new Error('Invalidated refresh token');

    if (!updateAccess) {
      const accessClaims = session.verifyToken(access);

      if (accessClaims) return [{ isAuth: true, user: accessClaims }];
    }

    const dbUser = await User.findById(refreshClaims.user_id);
    if (!dbUser) throw new Error('Invalid user');

    const user = {
      _id: dbUser._id,
      name: dbUser.name,
      isAdmin: dbUser.isAdmin,
      isManager: dbUser.isManager
    };

    const [accessCookie] = session.createAccessSession(user);

    return [{ isAuth: true, user }, [accessCookie]];
  } catch (error) {
    const cookies = session.removeSession();
    return [{ isAuth: false, user: null }, cookies];
  }
};
