import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { getQueryElements } from '@/utils/getQueryElements';
import getOrderFilters from '@/utils/getOrderFilters';
import OrderService from 'services/OrderService';
import UserService from 'services/UserService';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { isAuth, user } = req.session;

        // respond 401 Unauthorized if user is not authenticated
        if (!isAuth || !user) {
          res.status(401).json({ success: false, message: 'Unauthorized' });

          return;
        }

        const {
          search,
          filters: filtersQuery,
          byUserId,
          byUserEmail,
          offset,
          limit,
        } = getQueryElements(req.query);

        const { matchFilter, sortFilter } = getOrderFilters(filtersQuery);
        const options = {
          limit: +limit || 3,
          skip: +offset || 0,
          sort: sortFilter,
        };

        // get session user orders
        if (byUserId) {
          const dbOrders = await OrderService.queryOrdersByUserId(
            user._id,
            matchFilter,
            'number items total_price status orderedAt completedAt',
            options,
          );

          if (dbOrders.length) {
            const count = await OrderService.countOrdersByUserId(
              user._id,
              matchFilter,
            );

            res.status(200).json({ success: true, orders: dbOrders, count });
          } else {
            res.status(400).json({ success: false, message: 'Not Found' });
          }
        } else {
          // respond 401 Unauthorized if user doesn't have permission
          if (!user.isAdmin && !user.isManager) {
            res.status(401).json({ success: false, message: 'Unauthorized' });

            return;
          }

          if (search) {
            // ? I think this is not used anywhere o?
            if (byUserEmail) {
              // find user orders by user email

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

              if (dbOrders.length) {
                const count = await OrderService.countOrdersByUserId(
                  user._id,
                  matchFilter,
                );

                res
                  .status(200)
                  .json({ success: true, orders: dbOrders, count });
              } else {
                res.status(400).json({ success: false, message: 'Not Found' });
              }
            } else {
              // find order by its number
              const dbOrder = await OrderService.queryOrder(search);

              if (dbOrder) {
                res.status(200).json({ success: true, order: dbOrder });
              } else {
                res.status(404).json({ success: false, message: 'Not Found' });
              }
            }
          } else {
            // find orders with filters
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

              res.status(200).json({ success: true, orders: dbOrders, count });
            } else {
              res.status(400).json({ success: false, message: 'Not Found' });
            }
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
