import dbConnect from '@/utils/dbConnect';
import { Product } from '@/models/Product';
import { withSessionApi } from '@/utils/withSession';
import getProductFilters from '@/utils/getProductFilters';
import CategoryService from 'services/CategoryService';
import ProductService from 'services/ProductService';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'GET':
      await handleGet(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['GET'], req.method);

      break;
  }
});

/**
 * Get products byCategory name
 * Get product by name
 * Get recommended products
 * Get products list
 */
const handleGet = async (
  routeService: ApiRouteService<{
    products?: Product[];
    product?: Product;
    count?: number;
  }>,
) => {
  try {
    const {
      search,
      byCategory,
      recommended,
      filters: filtersQuery,
      offset,
      limit,
    } = routeService.getQuery();

    const { matchFilter, sortFilter } = getProductFilters(filtersQuery);

    const options = {
      limit: +limit || 3,
      skip: +offset || 0,
      sort: sortFilter,
    };

    // find products by category name with matched filters
    if (search && byCategory) {
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

        routeService.resOk({ products: dbCategory.products, count });
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // find product by name
    if (search) {
      const dbProduct = await ProductService.queryProduct(search);

      if (dbProduct) {
        routeService.resOk({ product: dbProduct });
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // find products (recommended or not) with matched filters
    const dbProducts = recommended
      ? await ProductService.listRecommendedProducts(options)
      : await ProductService.listProducts(matchFilter, null, options);

    if (dbProducts.length) {
      // get products count
      const count = await ProductService.countProducts(matchFilter);

      routeService.resOk({ products: dbProducts, count });
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
