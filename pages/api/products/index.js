import dbConnect from '@/utils/dbConnect';
import Product from 'models/Product';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { search } = req.query;

        if (search) {
          // find product
          const { name } = await validator.validateProductName({
            name: search
          });
          const dbProduct = await Product.findOne({ name });

          if (dbProduct) {
            res.status(200).json({ success: true, product: dbProduct });
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
