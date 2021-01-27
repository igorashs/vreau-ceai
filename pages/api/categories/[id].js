import dbConnect from '@/utils/dbConnect';
import Category from '@/models/Category';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'PUT':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user.isAdmin || user.isManager)) {
          const { id } = req.query;
          const { name } = req.body;

          const values = await validator.validateCategory({ name });
          const dbCategory = await Category.findOne(
            { name: values.name },
            'name'
          );

          if (dbCategory)
            validator.throwValidationError({
              message: 'Categoria cu acest nume deja există',
              key: 'name'
            });

          const dbUpdatedCategory = await Category.findById(id, 'name');
          dbUpdatedCategory.name = values.name;
          await dbUpdatedCategory.save();

          if (dbUpdatedCategory) {
            res
              .status(200)
              .json({ success: true, category: dbUpdatedCategory });
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
            errors: details
          });
        } else {
          res.status(400).json({ success: false, message: 'Bad Request' });
        }
      }

      break;

    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user.isAdmin || user.isManager)) {
          const { id } = req.query;

          const dbCategory = await Category.findByIdAndDelete(id);

          if (dbCategory) {
            res
              .status(200)
              .json({ success: true, message: 'Category deleted' });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request' });
      }

      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });
      break;
  }
});
