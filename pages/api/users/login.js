import User from '@/models/User';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { createAuthTokenCookie } from '@/utils/createAuthTokenCookie';

export default async function handle(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { email, password } = req.body;
        const values = await validator.validateUserLogin({ email, password });

        const dbUser = await User.findOne({ email: values.email });
        if (!dbUser) validator.throwUnauthorizedUserEmail();

        const match = await bcrypt.compare(values.password, dbUser.password);
        if (!match) validator.throwUnauthorizedUserPassword();

        res.setHeader(
          'Set-Cookie',
          createAuthTokenCookie({ name: dbUser.name, email: dbUser.email })
        );
        res.status(200).json({ success: true, message: 'Logare cu succes' });
      } catch (error) {
        const details = validator.getValidationErrorDetails(error);

        if (details) {
          res.status(400).json({
            success: false,
            message: 'Validation Errors',
            errors: details
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