import { User } from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import UserService from 'services/UserService';
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
 * Get User
 */
const handleGet = async (routeService: ApiRouteService<{ user?: User }>) => {
  try {
    // respond 401 Unauthorized if user is not authorized
    // respond 403 Forbidden if user doesn't have permission
    if (!routeService.isAuthorized({ isAdmin: true })) return;

    const { search } = routeService.getQuery();

    // respond 400 Validation Error if email is invalid
    const dbUser = await UserService.queryUser(
      search,
      'isManager _id name email',
    );

    if (dbUser) {
      routeService.resOk({ user: dbUser });
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
