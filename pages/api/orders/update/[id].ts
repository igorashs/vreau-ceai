import dbConnect from '@/utils/dbConnect';
import OrderModel, { Order } from 'models/Order';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { getQueryElements } from '@/utils/getQueryElements';
import { ApiResponse, OrderStatus } from 'types';

export default withSessionApi<ApiResponse & { order?: Order }>(
  async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
      case 'PUT':
        try {
          const { isAuth, user } = req.session;

          if (isAuth && (user?.isAdmin || user?.isManager)) {
            const { id } = getQueryElements(req.query);
            const { status: bodyStatus }: OrderStatus = req.body;

            const { status } = await validator.validateOrderStatus({
              status: bodyStatus,
            });

            const dbOrder: Order = await OrderModel.findById(id).populate({
              path: 'user',
              select: 'name email',
            });

            if (dbOrder) {
              if (dbOrder.status !== 'completed') {
                dbOrder.status = status;

                if (status === 'completed') dbOrder.completedAt = new Date();
                await dbOrder.save();

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
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
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
