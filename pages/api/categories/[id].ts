import dbConnect from '@/utils/dbConnect';
import { Category } from '@/models/Category';
import { withSessionApi } from '@/utils/withSession';
import { CategoryName } from 'types';
import CategoryService from 'services/CategoryService';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'PUT':
      await handlePut(routeService);

      break;

    case 'DELETE':
      await handleDelete(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['PUT', 'DELETE'], req.method);

      break;
  }
});

/**
 * Update category name
 */
const handlePut = async (
  routeService: ApiRouteService<{ category?: Category }>,
) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    // Respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    const { id } = routeService.getQuery();
    const { name }: CategoryName = routeService.getBody();

    // respond 400 Bad Request if name is invalid
    // respond 400 Bad Request if name is already used
    // respond 400 Bad Request if category doesn't exist
    const dbUpdatedCategory = await CategoryService.updateCategory(id, name);

    if (dbUpdatedCategory) {
      routeService.resOk({ category: dbUpdatedCategory });
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};

/**
 * Delete category
 */
const handleDelete = async (
  routeService: ApiRouteService<{ category?: Category }>,
) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    // Respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    const { id } = routeService.getQuery();
    const dbDeletedCategory = await CategoryService.deleteCategory(id);

    if (dbDeletedCategory) {
      routeService.resOk();
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
