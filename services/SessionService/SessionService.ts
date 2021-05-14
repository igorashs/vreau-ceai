import { Model } from 'mongoose';
import { Session } from '@/models/Session';
import { createSession, removeSession } from 'lib/session';
import { User } from '@/models/User';

const createUserSession = (SessionModel: Model<Session>) =>
  /**
   * Delete previous session and create a new user session
   *
   * @returns cookies
   */
  async (dbUser: User) => {
    const user = {
      _id: dbUser._id,
      name: dbUser.name,
      isAdmin: dbUser.isAdmin,
      isManager: dbUser.isManager,
    };

    const { cookies, refreshToken } = createSession(user, {
      user_id: dbUser._id,
    });

    // delete prev session if exists
    await SessionModel.findOneAndDelete({ user_id: dbUser._id });

    // create a new session for user
    const session = new SessionModel({
      user_id: dbUser._id,
      refresh_token: refreshToken,
    });

    await session.save();

    return cookies;
  };

const deleteUserSession = (SessionModel: Model<Session>) =>
  /**
   * Delete user session and invalidate cookies
   *
   * @returns invalidated cookies
   */
  async (user_id: string) => {
    await SessionModel.findOneAndDelete({ user_id }, { returnOriginal: false });
    const cookies = removeSession();

    return cookies;
  };

const querySession = (SessionModel: Model<Session>) =>
  /**
   * Query user session
   *
   * @returns Session | null
   */
  (user_id: string) =>
    SessionModel.findOne({
      user_id,
    });

export default (SessionModel: Model<Session>) => ({
  createUserSession: createUserSession(SessionModel),
  deleteUserSession: deleteUserSession(SessionModel),
  querySession: querySession(SessionModel),
});
