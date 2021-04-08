import dbConnect from '@/utils/dbConnect';
import CategoryModel, { Category } from '@/models/Category';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { ApiResponse } from 'types';

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
        const { search } = req.query;

        if (search) {
          // query one item
          const { name } = await validator.validateCategory({
            name: typeof search === 'string' ? search : search[0],
          });
          const dbCategory: Category = await CategoryModel.findOne({
            name,
          });

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
          // query all items
          const dbCategories: Array<Category> = await CategoryModel.find({});

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
        if (req.session.isAuth && req.session.user?.isAdmin) {
          const { name } = req.body;
          const values = await validator.validateCategory({ name });
          const dbCategory: Category = await CategoryModel.findOne({
            name: values.name,
          });

          if (dbCategory)
            validator.throwValidationError({
              message: 'Categoria cu acest nume deja există',
              key: 'name',
            });

          const category: Category = new CategoryModel({ name: values.name });
          await category.save();

          res.status(201).json({ success: true, message: 'Success' });
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
});
