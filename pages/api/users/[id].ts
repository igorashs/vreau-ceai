import { User } from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import { getQueryElements } from '@/utils/getQueryElements';
import * as validator from '@/utils/validator';
import { withSessionApi } from '@/utils/withSession';
import UserService from 'services/UserService';
import { ApiResponse, UserPermissions } from 'types';

export default withSessionApi<ApiResponse & { user?: User }>(
  async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          // respond 401 Unauthorized if user doesn't have permission
          if (!req.session.isAuth || !req.session.user?.isAdmin) {
            res.status(401).json({ success: false, message: 'Unauthorized' });

            return;
          }

          const { id } = getQueryElements(req.query);
          const { isManager }: UserPermissions = req.body;

          // respond 400 Validation Error if data is invalid
          const dbUser = await UserService.updateUserPermission(
            id,
            {
              isManager,
            },
            'isManager _id name email',
          );

          if (dbUser) {
            res
              .status(200)
              .json({ success: true, message: 'Success', user: dbUser });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
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
