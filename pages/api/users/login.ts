import UserModel, { User } from '@/models/User';
import SessionModel, { Session } from '@/models/Session';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { createSession } from 'lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, UserLogin } from 'types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { email, password }: UserLogin = req.body;
        const values = await validator.validateUserLogin({ email, password });

        const dbUser: User = await UserModel.findOne(
          { email: values.email },
          'name isAdmin isManager password',
        );
        if (!dbUser)
          validator.throwValidationError({
            message: 'e-mail greșit',
            key: 'email',
          });

        const match = await bcrypt.compare(values.password, dbUser.password);
        if (!match)
          validator.throwValidationError({
            message: 'parolă greșită',
            key: 'password',
          });

        const user = {
          _id: dbUser._id,
          name: dbUser.name,
          isAdmin: dbUser.isAdmin,
          isManager: dbUser.isManager,
        };

        const { cookies, refreshToken } = createSession(user, {
          user_id: dbUser._id,
        });

        // remove prev session if exists
        await SessionModel.findOneAndDelete({ user_id: dbUser._id });

        // save new session
        const session: Session = new SessionModel({
          user_id: dbUser._id,
          refresh_token: refreshToken,
        });
        await session.save();

        res.setHeader('Set-Cookie', cookies);

        res.status(200).json({ success: true, message: 'Success' });
      } catch (error) {
        const details = validator.getValidationErrorDetails(error);

        if (details) {
          res.status(400).json({
            success: false,
            message: 'Validation Errors',
            errors: details,
          });
        } else {
          res.status(400).json({ success: false, message: 'Bad Request' });
        }
      }

      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });
      break;
  }
}
