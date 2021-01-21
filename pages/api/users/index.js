import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { withSession } from '@/utils/withSession';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        if (req.session.isAuth && req.session.user.isAdmin) {
          const { search } = req.query;
          const { email } = await validator.validateEmail({ email: search });

          const dbUser = await User.findOne(
            { email },
            'isManager _id name email'
          );
          if (!dbUser) validator.throwUnauthorizedUserEmail();

          res.status(200).json({ success: true, user: dbUser });
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
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
});
