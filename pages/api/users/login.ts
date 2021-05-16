import dbConnect from '@/utils/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, UserLogin } from 'types';
import UserService from 'services/UserService';
import SessionService from 'services/SessionService';
import ApiRouteService from 'services/ApiRouteService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  await dbConnect();
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
 * Login user and create user session
 *
 */
const handlePost = async (routeService: ApiRouteService) => {
  try {
    const { email, password }: UserLogin = routeService.getBody();

    // respond 400 Validation Error if data is invalid
    // respond 400 Validation Error if email doesn't exist
    // respond 400 Validation Error passwords don't match
    const dbUser = await UserService.loginUser({ email, password });
    const cookies = await SessionService.createUserSession(dbUser);

    routeService.res.setHeader('Set-Cookie', cookies);
    routeService.resOk();
  } catch (error) {
    routeService.handleApiError(error);
  }
};
