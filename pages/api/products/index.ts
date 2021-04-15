import dbConnect from '@/utils/dbConnect';
import CategoryModel, { Category } from '@/models/Category';
import ProductModel, { Product } from '@/models/Product';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { ApiResponse } from 'types';
import { getQueryElements } from '@/utils/getQueryElements';

export default withSessionApi<
  ApiResponse & { products?: Product[]; product?: Product; count?: number }
>(async function handler(req, res) {
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
          limit,
        } = getQueryElements(req.query);

        const matchFilter: { recommend?: boolean } = {};
        const sortFilter: { price?: 1 | -1; total_quantity?: 1 | -1 } = {};

        if (filtersQuery) {
          const filters = Object.fromEntries(
            filtersQuery.split(' ').map((f) => [f, true]),
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
          sort: sortFilter,
        };

        if (search) {
          if (byCategory) {
            // find products by category with filters
            const { name } = await validator.validateCategory({
              name: search,
            });
            const dbCategory: Category & {
              products: Product[];
            } = await CategoryModel.findOne({ name })
              .populate({
                path: 'products',
                match: matchFilter,
                options,
              })
              .lean();

            if (dbCategory) {
              const count: number = await ProductModel.countDocuments({
                ...matchFilter,
                category_id: dbCategory._id,
              });

              res.status(200).json({
                success: true,
                message: 'Success',
                products: dbCategory.products,
                count,
              });
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          } else {
            // find product
            const { name } = await validator.validateProductName({
              name: search,
            });

            const dbProduct: Product = await ProductModel.findOne({ name });

            if (dbProduct) {
              res.status(200).json({
                success: true,
                message: 'Success',
                product: dbProduct,
              });
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          }
        } else {
          // find products with filters
          const dbProducts: Product[] = recommended
            ? await ProductModel.find({ recommend: true }, null, options)
                .populate({
                  path: 'category_id',
                  select: 'name',
                })
                .lean()
            : await ProductModel.find(matchFilter, null, options).lean();

          if (dbProducts.length) {
            const count: number = await ProductModel.countDocuments(
              matchFilter,
            );

            res.status(200).json({
              success: true,
              message: 'Success',
              products: dbProducts,
              count,
            });
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
