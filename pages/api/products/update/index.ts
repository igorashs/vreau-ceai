import { NextApiRequest, NextApiResponse } from 'next';
import ApiRouteService from 'services/ApiRouteService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const routeService = new ApiRouteService(req, res);

  routeService.resNotFound();
}
