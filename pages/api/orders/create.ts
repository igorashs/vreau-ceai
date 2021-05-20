import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import { ApiResponse, OrderItem, OrderSubmit } from 'types';
import ProductService from 'services/ProductService';
import OrderService from 'services/OrderService';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
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
});

/**
 * Create new order
 */
const handlePost = async (
  routeService: ApiRouteService<{ number: string }>,
) => {
  try {
    // Respond 401 Unauthorized if user is not authorized
    if (!routeService.isAuthorized()) return;

    const {
      info: bodyInfo,
      items: bodyItems,
    }: { info: OrderSubmit; items: OrderItem[] } = routeService.getBody();

    // respond 400 Validation Errors if the data is invalid
    // respond 400 Bad Request if the cart is corrupt
    const { items, total_price } = await ProductService.getCart(bodyItems);

    const { user } = routeService.getUserSession();

    // respond 400 Validation Error if data is invalid
    const { number } = await OrderService.createOrder({
      user: user._id,
      items,
      total_price,
      bodyInfo,
    });

    routeService.resCreated({ number });
  } catch (error) {
    routeService.handleApiError(error);
  }
};
