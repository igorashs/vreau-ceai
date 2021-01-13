import User from '@/models/User';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { createSession } from '@/utils/createSession';

export default async function handle(req, res) {
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
        if (dbUser) validator.throwUserAlreadyExists();

        const hashedPass = await bcrypt.hash(
          values.password,
          +process.env.SALT
        );
        const user = new User({ ...values, password: hashedPass });
        await user.save();

        const [session, auth] = createSession({
          user: {
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isManager: user.isManager
          }
        });

        res.setHeader('Set-Cookie', [session, auth]);

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
