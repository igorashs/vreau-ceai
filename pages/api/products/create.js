import dbConnect from '@/utils/dbConnect';
import Product from 'models/Product';
import Category from 'models/Category';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
const nanoid = require('nanoid');

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user.isAdmin || user.isManager)) {
          const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm({ maxFileSize: 1 * 1024 * 1024 });

            form.onPart = (part) => {
              if (part.filename) {
                const fileType = part.mime.split('/').pop();

                // validate allowed file types
                if (!['jpg', 'png', 'jpeg'].includes(fileType)) {
                  form.emit(
                    'error',
                    validator.createValidationError({
                      message: 'sunt permise doar imagini .png, .jpg și .jpeg',
                      key: 'src'
                    })
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
                      message: 'mărimea fișierului poate fi maximum 1MB',
                      key: 'src'
                    })
                  );
                } else {
                  return reject(err);
                }
              }
              resolve({ fields, files });
            });
          });

          // set src img if exists
          if (data.files.src) {
            data.fields.src = nanoid() + data.files.src.name.match(/\..+$/)[0];
          }

          const values = await validator.validateProduct(data.fields);

          const dbExistingProduct = await Product.findOne({
            name: values.name
          });

          if (dbExistingProduct)
            validator.throwValidationError({
              message: 'produs cu acest nume deja există',
              key: 'name'
            });

          const dbCategory = await Category.findById(values.category);

          if (!dbCategory)
            validator.throwValidationError({
              message: 'categoria nu există',
              key: 'category'
            });

          const product = new Product(values);
          await product.save();

          // save product img
          if (data.files.src) {
            await fs.rename(
              data.files.src.path,
              `public/uploads/${data.fields.src}`
            );
          }

          res.status(201).json({ success: true });
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

export const config = {
  api: {
    bodyParser: false
  }
};
