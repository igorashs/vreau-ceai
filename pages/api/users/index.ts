import UserModel, { User } from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import * as validator from '@/utils/validator';
import { withSessionApi } from '@/utils/withSession';
import { ApiResponse } from 'types';

export default withSessionApi<ApiResponse & { user?: User }>(
  async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
      case 'GET':
        try {
          if (req.session.isAuth && req.session.user?.isAdmin) {
            const { search } = req.query;
            const { email } = await validator.validateEmail({
              email: typeof search === 'string' ? search : search[0],
            });

            const dbUser: User = await UserModel.findOne(
              { email },
              'isManager _id name email',
            );

            if (dbUser) {
              res
                .status(200)
                .json({ success: true, message: 'Success', user: dbUser });
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
          }
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
  },
);
