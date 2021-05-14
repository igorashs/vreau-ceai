import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, UserLogin } from 'types';
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
        const { email, password }: UserLogin = req.body;

        // respond 400 Validation Error if data is invalid
        // respond 400 Validation Error if email doesn't exist
        // respond 400 Validation Error passwords don't match
        const dbUser = await UserService.loginUser({ email, password });
        const cookies = await SessionService.createUserSession(dbUser);

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
