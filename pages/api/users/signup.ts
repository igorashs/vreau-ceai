import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, UserSignup } from 'types';
import UserService from 'services/UserService';
import SessionService from 'services/SessionService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { name, email, password, repeat_password }: UserSignup = req.body;

        // respond 400 Validation Error if data is invalid
        // respond 400 Validation Error if email already exists
        const newUser = await UserService.signupUser({
          name,
          email,
          password,
          repeat_password,
        });
        const cookies = await SessionService.createUserSession(newUser);

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
