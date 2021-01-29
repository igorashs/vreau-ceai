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
  let tmpSrc;

  switch (req.method) {
    case 'PUT':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user.isAdmin || user.isManager)) {
          const { id } = req.query;

          const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm({
              uploadDir: process.cwd() + '/public/uploads',
              maxFileSize: 1 * 1024 * 1024
            });

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
            tmpSrc = data.files.src.path;
          }

          const values = await validator.validateProduct(data.fields);
          const dbExistingProduct = await Product.findById(id);

          if (!dbExistingProduct)
            validator.throwValidationError({
              message: 'categoria nu există',
              key: 'category'
            });

          if (dbExistingProduct._id.toString() !== id)
            validator.throwValidationError({
              message: 'un produs cu acest nume deja există',
              key: 'name'
            });

          if (dbExistingProduct.category_id.toString() !== values.category_id) {
            // add to new category product list
            const dbCategory = await Category.findByIdAndUpdate(
              values.category_id,
              { $push: { products: dbExistingProduct._id } },
              { projection: 'name' }
            );

            if (!dbCategory)
              validator.throwValidationError({
                message: 'categoria nu există',
                key: 'category'
              });

            // remove from prev category product list
            await Category.findByIdAndUpdate(
              dbExistingProduct.category_id,
              { $pull: { products: dbExistingProduct._id } },
              { projection: 'name' }
            );
          }

          const defaultImg = 'placeholder.png';

          // remove prev img if new img is provided
          if (
            values.src === defaultImg &&
            dbExistingProduct.src !== defaultImg
          ) {
            values.src = dbExistingProduct.src;
          } else if (
            values.src !== defaultImg &&
            dbExistingProduct.src !== defaultImg
          ) {
            await fs.unlink(
              `${process.cwd()}/public/uploads/${dbExistingProduct.src}`
            );
          }

          // rename product img
          if (data.files.src) {
            await fs.rename(
              data.files.src.path,
              `${process.cwd()}/public/uploads/${data.fields.src}`
            );
          }

          const dbUpdatedProduct = await Product.findByIdAndUpdate(id, values, {
            new: true
          });

          if (dbUpdatedProduct) {
            res.status(200).json({ success: true, product: dbUpdatedProduct });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      } catch (error) {
        try {
          if (tmpSrc) await fs.unlink(tmpSrc);
        } catch (error) {
          console.error(error);
        }

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
