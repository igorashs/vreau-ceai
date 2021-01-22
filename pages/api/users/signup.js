import User from '@/models/User';
import Token from '@/models/Token';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { createSession } from 'lib/session';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { name, email, password } = req.body;
        const values = await validator.validateUserSignup({
          name,
          email,
          password
        });

        const dbUser = await User.findOne({ email: values.email });
        if (dbUser)
          validator.throwValidationError({
            message: 'utilizatorul cu acest e-mail deja există',
            key: 'email'
          });

        const hashedPass = await bcrypt.hash(
          values.password,
          +process.env.SALT
        );
        const newUser = new User({ ...values, password: hashedPass });
        await newUser.save();

        const user = {
          _id: newUser._id,
          name: newUser.name,
          isAdmin: newUser.isAdmin,
          isManager: newUser.isManager
        };

        const { cookies, refreshToken } = createSession(user, {
          user_id: newUser._id
        });

        const token = new Token({
          user_id: newUser._id,
          refresh_token: refreshToken
        });
        await token.save();

        res.setHeader('Set-Cookie', cookies);

        res
          .status(201)
          .json({ success: true, message: 'Înregistrare finalizată' });
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
