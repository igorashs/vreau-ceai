import dbConnect from '@/utils/dbConnect';
import { Product } from '@/models/Product';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { ApiResponse } from 'types';
import { getQueryElements } from '@/utils/getQueryElements';
import getProductFilters from '@/utils/getProductFilters';
import CategoryService from 'services/CategoryService';
import ProductService from 'services/ProductService';

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

        const { matchFilter, sortFilter } = getProductFilters(filtersQuery);

        const options = {
          limit: +limit || 3,
          skip: +offset || 0,
          sort: sortFilter,
        };

        if (search) {
          // find specific products
          if (byCategory) {
            // find products by category with filters

            // respond 400 Validation Error if name is invalid
            const dbCategory = await CategoryService.queryCategoryWithProducts(
              search,
              matchFilter,
              options,
            );

            if (dbCategory) {
              // get products count
              const count = await ProductService.countProductsByCategoryId(
                dbCategory._id,
                matchFilter,
              );

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
            // find product by name
            const dbProduct = await ProductService.queryProduct(search);

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
          const dbProducts = recommended
            ? await ProductService.listRecommendedProducts(options)
            : await ProductService.listProducts(matchFilter, null, options);

          if (dbProducts.length) {
            // get products count
            const count = await ProductService.countProducts(matchFilter);

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
