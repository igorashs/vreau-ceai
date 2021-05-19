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
    case 'GET':
      await handleGet(routeService);

      break;

    case 'POST':
      await handlePost(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['GET', 'POST'], req.method);

      break;
  }
});

/**
 * Get one category by name ||
 * Get all categories
 */
const handleGet = async (
  routeService: ApiRouteService<{
    category?: Category;
    categories?: Category[];
  }>,
) => {
  try {
    const { search } = routeService.getQuery();

    // find one category by name
    if (search) {
      // respond 400 Bad Request if the name is invalid
      const dbCategory = await CategoryService.queryCategory(search);

      if (dbCategory) {
        routeService.resOk({ category: dbCategory });
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // list all categories
    const dbCategories = await CategoryService.listCategories();

    if (dbCategories.length) {
      routeService.resOk({ categories: dbCategories });
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};

/**
 * Create new category
 */
const handlePost = async (
  routeService: ApiRouteService<{ category?: Category }>,
) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    // Respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    const { name }: CategoryName = routeService.getBody();

    // respond 400 Bad Request if the name is invalid
    // respond 400 Bad Request if the name is already used
    const dbCategory = await CategoryService.createCategory(name);

    routeService.resCreated({ category: dbCategory });
  } catch (error) {
    routeService.handleApiError(error);
  }
};
