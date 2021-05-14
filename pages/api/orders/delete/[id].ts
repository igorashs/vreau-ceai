import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { getQueryElements } from '@/utils/getQueryElements';
import { ApiResponse } from 'types';
import OrderService from 'services/OrderService';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        // respond 401 Unauthorized if user is not authenticated
        if (!isAuth || !user) {
          res.status(401).json({ success: false, message: 'Unauthorized' });

          return;
        }

        const { id } = getQueryElements(req.query);

        if (user.isAdmin || user.isManager) {
          // delete order
          const deletedOrder = await OrderService.deleteOrder(id);

          if (deletedOrder) {
            res.status(200).json({ success: true, message: 'Order deleted' });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
        } else {
          // user deletes its own order
          const deletedOrder = await OrderService.deleteUserOrder(id, user._id);

          if (deletedOrder) {
            res.status(200).json({ success: true, message: 'Order deleted' });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
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
