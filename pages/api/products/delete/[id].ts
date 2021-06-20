import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import ProductService from 'services/ProductService';
import CategoryService from 'services/CategoryService';
import ApiRouteService from 'services/ApiRouteService';
import { Product } from '@/models/Product';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'DELETE':
      await handleDelete(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['DELETE'], req.method);

      break;
  }
});

/**
 * Delete product
 */
const handleDelete = async (
  routeService: ApiRouteService<{ product?: Product }>,
) => {
  try {
    // respond 401 Unauthorized if user is not authorized
    // respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    const { id } = routeService.getQuery();
    const deletedProduct = await ProductService.deleteProduct(id);

    if (deletedProduct) {
      // remove from prev category product list
      await CategoryService.deleteProductFromCategory(
        deletedProduct.category_id.toString(),
        deletedProduct._id,
      );

      routeService.resOk();
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
