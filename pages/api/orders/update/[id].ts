import dbConnect from '@/utils/dbConnect';
import { Order } from 'models/Order';
import { withSessionApi } from '@/utils/withSession';
import { OrderStatus } from 'types';
import OrderService from 'services/OrderService';
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
 * Update order status
 */
const handlePut = async (routeService: ApiRouteService<{ order?: Order }>) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    // Respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    const { id } = routeService.getQuery();
    const { status }: OrderStatus = routeService.getBody();

    // respond 400 Bad Request if status is invalid
    const { dbOrder, modified } = await OrderService.updateOrder(id, status);

    // respond 404 Not Found if order doesn't exist
    if (!dbOrder) {
      routeService.resNotFound();

      return;
    }

    if (modified) {
      routeService.resOk({ order: dbOrder });
    } else {
      routeService.resNotModified({ order: dbOrder });
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
