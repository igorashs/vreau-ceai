import dbConnect from '@/utils/dbConnect';
import Order from 'models/Order';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        if (isAuth) {
          const { id } = req.query;

          const dbOrder = await Order.findById(id, 'status').populate({
            path: 'user',
            select: '_id'
          });

          if (user.isAdmin || user.isManager) {
            const deletedOrder = await Order.findByIdAndDelete(id, {
              projection: '_id'
            });

            if (deletedOrder) {
              res.status(200).json({ success: true, message: 'Order deleted' });
            } else {
              res.status(404).json({ success: false, message: 'Not Found' });
            }
          } else if (dbOrder._id.toString() === user._id) {
            if (
              dbOrder.status === 'completed' ||
              dbOrder.status === 'canceled'
            ) {
              const deletedOrder = await Order.findByIdAndDelete(id, {
                projection: '_id'
              });

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
        console.log(error);
        const details = validator.getValidationErrorDetails(error);

        if (details) {
          res.status(400).json({
            success: false,
            message: 'Validation Errors',
            errors: details
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
