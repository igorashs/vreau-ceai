import dbConnect from '@/utils/dbConnect';
import OrderModel, { Order } from 'models/Order';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { getQueryElements } from '@/utils/getQueryElements';
import { ApiResponse } from 'types';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        if (isAuth) {
          const { id } = getQueryElements(req.query);

          const dbOrder: Order = await OrderModel.findById(
            id,
            'status',
          ).populate({
            path: 'user',
            select: '_id',
          });

          if (user?.isAdmin || user?.isManager) {
            const deletedOrder: Order = await OrderModel.findByIdAndDelete(id, {
              projection: '_id',
            });

            if (deletedOrder) {
              res.status(200).json({ success: true, message: 'Order deleted' });
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          } else if (dbOrder._id.toString() === user?._id) {
            if (
              dbOrder.status === 'completed' ||
              dbOrder.status === 'canceled'
            ) {
              const deletedOrder: Order = await OrderModel.findByIdAndDelete(
                id,
                {
                  projection: '_id',
                },
              );

              if (deletedOrder) {
                res
                  .status(200)
                  .json({ success: true, message: 'Order deleted' });
              } else {
                res.status(404).json({ success: false, message: 'Not Found' });
              }
            } else {
              res.status(401).json({ success: false, message: 'Unauthorized' });
            }
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
});
