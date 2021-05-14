import dbConnect from '@/utils/dbConnect';
import { Category } from '@/models/Category';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { ApiResponse, CategoryName } from 'types';
import { getQueryElements } from '@/utils/getQueryElements';
import CategoryService from 'services/CategoryService';

export default withSessionApi<
  ApiResponse & {
    category?: Category;
    categories?: Category[];
  }
>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { search } = getQueryElements(req.query);

        if (search) {
          // find one category
          // respond 400 Bad Request if the name is invalid
          const dbCategory = await CategoryService.queryCategory(search);

          if (dbCategory) {
            res.status(200).json({
              success: true,
              message: 'Success',
              category: dbCategory,
            });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
        } else {
          // list all categories
          const dbCategories = await CategoryService.listCategories();

          if (dbCategories.length) {
            res.status(200).json({
              success: true,
              message: 'Success',
              categories: dbCategories,
            });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
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

    case 'POST':
      try {
        const { isAuth, user } = req.session;

        // respond 401 Unauthorized if user doesn't have permission
        if (!isAuth || (!user?.isAdmin && !user?.isManager)) {
          res.status(401).json({ success: false, message: 'Unauthorized' });

          return;
        }

        const { name }: CategoryName = req.body;

        // respond 400 Bad Request if the name is invalid
        // respond 400 Bad Request if the name is already used
        const dbCategory = await CategoryService.createCategory(name);

        res
          .status(201)
          .json({ success: true, message: 'Success', category: dbCategory });
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
});
