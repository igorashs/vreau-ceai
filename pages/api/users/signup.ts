import dbConnect from '@/utils/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, UserSignup } from 'types';
import UserService from 'services/UserService';
import SessionService from 'services/SessionService';
import ApiRouteService from 'services/ApiRouteService';
import { Session } from '@/models/Session';

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
 * SignUp user
 *
 */
const handlePost = async (
  routeService: ApiRouteService<{ session?: Session }>,
) => {
  try {
    const {
      name,
      email,
      password,
      repeat_password,
    }: UserSignup = routeService.getBody();

    // respond 400 Validation Error if data is invalid
    // respond 400 Validation Error if email already exists
    const newUser = await UserService.signupUser({
      name,
      email,
      password,
      repeat_password,
    });
    const cookies = await SessionService.createUserSession(newUser);

    routeService.res.setHeader('Set-Cookie', cookies);
    routeService.resCreated();
  } catch (error) {
    routeService.handleApiError(error);
  }
};
