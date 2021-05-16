import { NextApiRequest, NextApiResponse } from 'next';
import ApiRouteService from 'services/ApiRouteService';
import { SessionAuth } from 'types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'POST':
      await handlePost(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['POST'], req.method);

      break;
  }
}

/**
 * Refresh user session (access token)
 *
 */
const handlePost = async (
  routeService: ApiRouteService<{ session?: SessionAuth }>,
) => {
  try {
    const session = await routeService.refreshSession();

    if (session.isAuth) {
      routeService.resOk({ session });
    } else {
      routeService.resUnauthorized();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
