import dbConnect from '@/utils/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const {
          search,
          byCategory,
          recommended,
          filters: filtersQuery,
          offset,
          limit
        } = req.query;

        let matchFilter = {};
        let sortFilter = {};

        if (filtersQuery) {
          const filters = Object.fromEntries(
            filtersQuery.split(' ').map((f) => [f, true])
          );

          if (filters.recommend) matchFilter.recommend = true;

          if (filters.ascPrice) sortFilter.price = 1;
          else if (filters.descPrice) sortFilter.price = -1;

          if (filters.ascQuantity) sortFilter.total_quantity = 1;
          else if (filters.descQuantity) sortFilter.total_quantity = -1;
        }

        const options = {
          limit: +limit || 3,
          skip: +offset || 0,
          sort: sortFilter
        };

        if (search) {
          if (byCategory) {
            // find products by category with filters
            const { name } = await validator.validateCategory({ name: search });
            const dbCategory = await Category.findOne({ name })
              .populate({
                path: 'products',
                match: matchFilter,
                options
              })
              .lean();

            if (dbCategory) {
              const count = await Product.countDocuments({
                ...matchFilter,
                category_id: dbCategory._id
              });

              res.status(200).json({
                success: true,
                products: dbCategory.products,
                count
              });
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          } else {
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
        } else {
          // find products with filters
          const dbProducts = recommended
            ? await Product.find(matchFilter, null, options)
                .populate({
                  path: 'category_id',
                  select: 'name'
                })
                .lean()
            : await Product.find(matchFilter, null, options)
              .lean();

          if (dbProducts.length) {
            const count = await Product.countDocuments(matchFilter);

            res
              .status(200)
              .json({ success: true, products: dbProducts, count });
          } else {
            res.status(400).json({ success: false, message: 'Not Found' });
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
