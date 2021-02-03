import dbConnect from '@/utils/dbConnect';
import Order from 'models/Order';
import User from 'models/User';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { isAuth, user } = req.session;

        if (isAuth) {
          const {
            search,
            filters: filtersQuery,
            byUserId,
            byUserEmail,
            offset,
            limit
          } = req.query;

          let matchFilter = {
            status: []
          };
          let sortFilter = {};

          if (filtersQuery) {
            const filters = Object.fromEntries(
              filtersQuery.split(' ').map((f) => [f, true])
            );

            if (filters.processing) matchFilter.status.push('processing');
            if (filters.inDelivery) matchFilter.status.push('inDelivery');
            if (filters.canceled) matchFilter.status.push('canceled');
            if (filters.completed) matchFilter.status.push('completed');

            if (filters.lastOrdered) sortFilter.orderedAt = -1;
            else if (filters.firstOrdered) sortFilter.orderedAt = 1;
          }

          if (!matchFilter.status.length) delete matchFilter.status;

          const options = {
            limit: +limit || 3,
            skip: +offset || 0,
            sort: sortFilter
          };

          if (byUserId) {
            const dbOrders = await Order.find(
              {
                ...matchFilter,
                user: user._id
              },
              'number items total_price status orderedAt completedAt',
              options
            ).lean();

            if (dbOrders.length) {
              const count = await Order.countDocuments(matchFilter);

              res.status(200).json({ success: true, orders: dbOrders, count });
            } else {
              res.status(400).json({ success: false, message: 'Not Found' });
            }
          } else if (user.isAdmin || user.isManager) {
            if (search) {
              if (byUserEmail) {
                const { email } = await validator.validateEmail({
                  email: search
                });

                const dbUser = await User.findOne({ email }, '_id').lean();

                if (!dbUser)
                  validator.throwValidationError({
                    message: 'utilizatorul cu acest email nu există',
                    key: 'email'
                  });

                const dbOrders = await Order.find(
                  {
                    ...matchFilter,
                    user: dbUser._id
                  },
                  null,
                  options
                )
                  .populate({
                    path: 'user',
                    select: 'name email'
                  })
                  .lean();

                if (dbOrders.length) {
                  const count = await Order.countDocuments(matchFilter);

                  res
                    .status(200)
                    .json({ success: true, orders: dbOrders, count });
                } else {
                  res
                    .status(400)
                    .json({ success: false, message: 'Not Found' });
                }
              } else {
                const { number } = await validator.validateOrderNumber({
                  number: search
                });

                const dbOrder = await Order.findOne({ number })
                  .populate({
                    path: 'user',
                    select: 'name email'
                  })
                  .lean();

                if (dbOrder) {
                  res.status(200).json({ success: true, order: dbOrder });
                } else {
                  res
                    .status(404)
                    .json({ success: false, message: 'Not Found' });
                }
              }
            } else {
              // find orders with filters
              const dbOrders = await Order.find(
                matchFilter,
                null,
                options
              ).lean();

              if (dbOrders.length) {
                const count = await Order.countDocuments(matchFilter);

                res
                  .status(200)
                  .json({ success: true, orders: dbOrders, count });
              } else {
                res.status(400).json({ success: false, message: 'Not Found' });
              }
            }
          } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
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
