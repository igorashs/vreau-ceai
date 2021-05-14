import dbConnect from '@/utils/dbConnect';
import { Order } from 'models/Order';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { getQueryElements } from '@/utils/getQueryElements';
import { ApiResponse, OrderStatus } from 'types';
import OrderService from 'services/OrderService';

export default withSessionApi<ApiResponse & { order?: Order }>(
  async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          const { isAuth, user } = req.session;

          // respond 401 Unauthorized if user doesn't have permission
          if (!isAuth || (!user?.isAdmin && !user?.isManager)) {
            res.status(401).json({ success: false, message: 'Unauthorized' });

            return;
          }

          const { id } = getQueryElements(req.query);
          const { status }: OrderStatus = req.body;

          // respond 400 Bad Request if status is invalid
          const { dbOrder, modified } = await OrderService.updateOrder(
            id,
            status,
          );

          // respond 404 Not Found if order doesn't exist
          if (!dbOrder) {
            res.status(404).json({ success: false, message: 'Not Found' });

            return;
          }

          if (modified) {
            res
              .status(200)
              .json({ success: true, message: 'Success', order: dbOrder });
          } else {
            res.status(304).json({
              success: true,
              message: 'Not Modified',
              order: dbOrder,
            });
          }
        } catch (error) {
          const details = validator.getValidationErrorDetails(error);

          if (details) {
            res.status(400).json({
              success: false,
              message: 'Validation Errors',
              errors: details,
            });
          } else {
            res.status(400).json({ success: false, message: 'Bad Request' });
          }
        }
        break;

      default:
        res.status(400).json({ success: false, message: 'Bad Request' });

        break;
    }
  },
);
