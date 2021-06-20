import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import OrderService from 'services/OrderService';
import ApiRouteService from 'services/ApiRouteService';
import { Order } from '@/models/Order';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'DELETE':
      await handleDelete(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['DELETE'], req.method);

      break;
  }
});

/**
 * Delete order
 * Delete user order (his own)
 */
const handleDelete = async (
  routeService: ApiRouteService<{ order?: Order }>,
) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    if (!routeService.isAuthorized()) return;

    const { id } = routeService.getQuery();
    const { user } = routeService.getUserSession();

    // delete order
    if (user.isAdmin || user.isManager) {
      const deletedOrder = await OrderService.deleteOrder(id);

      if (deletedOrder) {
        routeService.resOk();
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // delete user order
    const deletedOrder = await OrderService.deleteUserOrder(id, user._id);

    if (deletedOrder) {
      routeService.resOk();
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
