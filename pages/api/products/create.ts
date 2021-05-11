import dbConnect from '@/utils/dbConnect';
import ProductModel, { Product } from 'models/Product';
import CategoryModel, { Category } from 'models/Category';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { Fields, Files, File, IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { nanoid } from 'nanoid';
import { ApiResponse, Formidable } from 'types';
import { productMessages } from '@/utils/validator/schemas/product';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();
  let tmpSrc;

  switch (req.method) {
    case 'POST':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user?.isAdmin || user?.isManager)) {
          const data: {
            fields: Fields & { src?: string };
            files: Files & { src?: File };
          } = await new Promise((resolve, reject) => {
            const form: Formidable = new IncomingForm({
              uploadDir: `${process.cwd()}/public/uploads`,
              maxFileSize: 1 * 1024 * 1024,
              multiples: false,
            });

            form.onPart = (part) => {
              if (part.filename) {
                const fileType = part.mime?.split('/').pop() ?? '';

                // validate allowed file types
                if (!['jpg', 'png', 'jpeg'].includes(fileType)) {
                  form.emit(
                    'error',
                    validator.createValidationError({
                      message: productMessages.src.invalid,
                      key: 'src',
                    }),
                  );
                }
              }

              form.handlePart(part);
            };

            form.parse(req, (err, fields, files) => {
              if (err) {
                if (err.message.includes('maxFileSize')) {
                  reject(
                    validator.createValidationError({
                      message: productMessages.src.max,
                      key: 'src',
                    }),
                  );
                } else {
                  reject(err);
                }
              }

              resolve({ fields, files });
            });
          });

          // set src img if exists
          if (data.files.src) {
            const matches = data.files?.src.name?.match(/\..+$/);
            data.fields.src = nanoid() + (matches && matches[0]);
            tmpSrc = data.files.src.path;
          }

          const values = await validator.validateProduct(data.fields);
          const dbExistingProduct: Product = await ProductModel.findOne(
            {
              name: values.name,
            },
            'name',
          );

          if (dbExistingProduct)
            validator.throwValidationError({
              message: productMessages.name.exists,
              key: 'name',
            });

          const product = new ProductModel(values);
          // ! it might be wise to check if category_id is a valid id before querying?
          const dbCategory: Category = await CategoryModel.findByIdAndUpdate(
            values.category_id,
            { $push: { products: product._id } },
            { projection: 'name' },
          );

          if (!dbCategory)
            validator.throwValidationError({
              message: productMessages.category_id.invalid,
              key: 'category',
            });

          await product.save();

          // rename product img
          if (data.files.src) {
            await fs.rename(
              data.files.src.path,
              `${process.cwd()}/public/uploads/${data.fields.src}`,
            );
          }

          res.status(201).json({ success: true, message: 'Success' });
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      } catch (error) {
        try {
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
});

export const config = {
  api: {
    bodyParser: false,
  },
};
