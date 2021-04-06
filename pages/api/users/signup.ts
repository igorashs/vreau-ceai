import UserModel, { User } from '@/models/User';
import SessionModel, { Session } from '@/models/Session';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { createSession } from 'lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, UserSignup } from 'types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { name, email, password, repeat_password }: UserSignup = req.body;

        const values = await validator.validateUserSignup({
          name,
          email,
          password,
          repeat_password,
        });

        const dbUser: User = await UserModel.findOne(
          { email: values.email },
          'email',
        );
        if (dbUser)
          validator.throwValidationError({
            message: 'utilizatorul cu acest e-mail deja există',
            key: 'email',
          });

        const hashedPass = await bcrypt.hash(
          values.password,
          +(process.env.SALT as string),
        );
        const newUser: User = new UserModel({
          ...values,
          password: hashedPass,
        });
        await newUser.save();

        const user = {
          _id: newUser._id,
          name: newUser.name,
          isAdmin: newUser.isAdmin,
          isManager: newUser.isManager,
        };

        const { cookies, refreshToken } = createSession(user, {
          user_id: newUser._id,
        });

        const session: Session = new SessionModel({
          user_id: newUser._id,
          refresh_token: refreshToken,
        });
        await session.save();

        res.setHeader('Set-Cookie', cookies);

        res.status(201).json({ success: true, message: 'Success' });
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
