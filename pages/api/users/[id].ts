import { User } from '@/models/User';
import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import UserService from 'services/UserService';
import { UserPermissions } from 'types';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'PUT':
      await handlePut(routeService);

      break;
    default:
      routeService.resMethodNotAllowed(['PUT'], req.method);

      break;
  }
});

/**
 * Update user Permission
 */
const handlePut = async (routeService: ApiRouteService<{ user?: User }>) => {
  try {
    // respond 401 Unauthorized if user is not authorized
    // respond 403 Forbidden if user doesn't have permission
    if (!routeService.isAuthorized({ isAdmin: true })) return;

    const { id } = routeService.getQuery();
    const { isManager }: UserPermissions = routeService.getBody();

    // respond 400 Validation Error if data is invalid
    const dbUser = await UserService.updateUserPermission(
      id,
      {
        isManager,
      },
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
