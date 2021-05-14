import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { promises as fs } from 'fs';
import { ApiResponse } from 'types';
import FormidableParser from '@/utils/FormidableParser';
import ProductService from 'services/ProductService';
import CategoryService from 'services/CategoryService';
import { Product } from '@/models/Product';
import generateUniqueFileName from '@/utils/generateUniqueFileName';

export default withSessionApi<ApiResponse & { product?: Product }>(
  async function handler(req, res) {
    await dbConnect();
    let tmpSrc;

    switch (req.method) {
      case 'POST':
        try {
          const { isAuth, user } = req.session;

          // respond 401 Unauthorized if user doesn't have permission
          if (!isAuth || (!user?.isAdmin && !user?.isManager)) {
            res.status(401).json({ success: false, message: 'Unauthorized' });

            return;
          }

          // get product form data
          const { fields, files } = await FormidableParser.handleProductForm(
            req,
            {
              uploadDir: `${process.cwd()}/public/uploads`,
              maxFileSize: 1 * 1024 * 1024,
              multiples: false,
            },
            ['jpg', 'png', 'jpeg'],
          );

          // set src file if exists
          if (files.src && files.src.name) {
            // create unique file name
            fields.src = generateUniqueFileName(files.src.name);

            // store name for unexpected errors
            tmpSrc = fields.src;
          }

          // respond 400 Validation Error if name is invalid
          // respond 400 Validation Error if product exists
          await ProductService.throwIfProductExists(fields.name);

          // respond 400 Validation Error if category doesn't exist
          const dbCategory = await CategoryService.findCategoryById(
            fields.category_id,
          );

          // create new product
          // respond 400 Validation Error if data is invalid
          const dbProduct = await ProductService.createProduct(fields);

          // add product to category
          // respond 400 Validation Error if category doesn't exist
          await CategoryService.addProductToCategory(
            dbCategory._id,
            dbProduct._id,
          );

          // rename product img if it was provided
          if (files.src) {
            await fs.rename(
              files.src.path,
              `${process.cwd()}/public/uploads/${fields.src}`,
            );
          }

          res
            .status(201)
            .json({ success: true, message: 'Success', product: dbProduct });
        } catch (error) {
          try {
            // remove temp img if something went wrong
            if (tmpSrc) await fs.unlink(tmpSrc);
          } catch (fsError) {
            // console.error(fsError);
          }

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

export const config = {
  api: {
    bodyParser: false,
  },
};
