import { withSessionApi } from '@/utils/withSession';
import { ApiResponse } from 'types';
import SessionService from 'services/SessionService';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'POST':
      await handlePost(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['POST'], req.method);

      break;
  }
});

/**
 * Delete user session
 *
 */
const handlePost = async (routeService: ApiRouteService) => {
  try {
    // respond 401 Unauthorized if user is not authorized
    if (!routeService.isAuthorized()) return;

    const session = routeService.getUserSession();
    const cookies = await SessionService.deleteUserSession(session.user?._id);

    routeService.res.setHeader('Set-Cookie', cookies);
    routeService.resOk();
  } catch (error) {
    routeService.handleApiError(error);
  }
};
