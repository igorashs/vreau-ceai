import dbConnect from '@/utils/dbConnect';
import { Category } from '@/models/Category';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { ApiResponse, CategoryName } from 'types';
import { getQueryElements } from '@/utils/getQueryElements';
import CategoryService from 'services/CategoryService';

export default withSessionApi<ApiResponse & { category?: Category }>(
  async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          const { isAuth, user } = req.session;

          // respond 401 Unauthorized if user doesn't have permission
          if (!isAuth || (!user?.isAdmin && !user?.isManager)) {
            res.status(401).json({ success: false, message: 'Unauthorized' });

            return;
          }

          const { id } = getQueryElements(req.query);
          const { name }: CategoryName = req.body;

          // respond 400 Bad Request if name is invalid
          // respond 400 Bad Request if name is already used
          // respond 400 Bad Request if category doesn't exist
          const dbUpdatedCategory = await CategoryService.updateCategory(
            id,
            name,
          );

          if (dbUpdatedCategory) {
            res.status(200).json({
              success: true,
              message: 'Success',
              category: dbUpdatedCategory,
            });
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

      case 'DELETE':
        try {
          const { isAuth, user } = req.session;

          // respond 401 Unauthorized if user doesn't have permission
          if (!isAuth || (!user?.isAdmin && !user?.isManager)) {
            res.status(401).json({ success: false, message: 'Unauthorized' });

            return;
          }

          const { id } = getQueryElements(req.query);
          const dbDeletedCategory = await CategoryService.deleteCategory(id);

          if (dbDeletedCategory) {
            res
              .status(200)
              .json({ success: true, message: 'Category deleted' });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
        } catch (error) {
          res.status(400).json({ success: false, message: 'Bad Request' });
        }

        break;

      default:
        res.status(400).json({ success: false, message: 'Bad Request' });
        break;
    }
  },
);
