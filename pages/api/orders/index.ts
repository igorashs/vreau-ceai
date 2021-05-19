import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import getOrderFilters from '@/utils/getOrderFilters';
import OrderService from 'services/OrderService';
import UserService from 'services/UserService';
import ApiRouteService from 'services/ApiRouteService';
import { Order } from '@/models/Order';

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
 * Get session user orders (by userId) ||
 * Get user orders by email ||
 * Get order by its number ||
 * Get orders with matched filters
 */
const handleGet = async (
  routeService: ApiRouteService<{
    orders?: Order[];
    count?: number;
    order?: Order;
  }>,
) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    if (!routeService.isAuthorized()) return;

    const {
      search,
      filters: filtersQuery,
      byUserId,
      byUserEmail,
      offset,
      limit,
    } = routeService.getQuery();

    const { matchFilter, sortFilter } = getOrderFilters(filtersQuery);
    const options = {
      limit: +limit || 3,
      skip: +offset || 0,
      sort: sortFilter,
    };

    // get session user orders
    if (byUserId) {
      const { user } = routeService.getUserSession();
      const dbOrders = await OrderService.queryOrdersByUserId(
        user._id,
        matchFilter,
        'number items total_price status orderedAt completedAt',
        options,
      );

      if (dbOrders.length) {
        const count = await OrderService.countOrdersByUserId(
          user?._id,
          matchFilter,
        );

        routeService.resOk({ orders: dbOrders, count });
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // Respond 401 Unauthorized if user is not authorized
    // Respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    // get user orders by email
    if (search && byUserEmail) {
      // ? i think this one is not used
      // respond 400 Validation Error if the name is invalid
      // Respond 400 Validation Error if user doesn't exist
      const dbUser = await UserService.findUser(search, '_id');

      const dbOrders = await OrderService.listOrdersByUserId(
        dbUser._id,
        matchFilter,
        null,
        options,
      ).populate({
        path: 'user',
        select: 'name email',
      });

      const { user } = routeService.getUserSession();

      if (dbOrders.length) {
        const count = await OrderService.countOrdersByUserId(
          user._id,
          matchFilter,
        );

        routeService.resOk({ orders: dbOrders, count });
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // get order by its number
    if (search) {
      const dbOrder = await OrderService.queryOrder(search);

      if (dbOrder) {
        routeService.resOk({ order: dbOrder });
      } else {
        routeService.resNotFound();
      }

      return;
    }

    // get orders with matched filters
    const dbOrders = await OrderService.listOrders(
      matchFilter,
      null,
      options,
    ).populate({
      path: 'user',
      select: 'name email',
    });

    if (dbOrders.length) {
      const count = await OrderService.countOrders(matchFilter);

      routeService.resOk({ orders: dbOrders, count });
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    routeService.handleApiError(error);
  }
};
