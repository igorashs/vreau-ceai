import dbConnect from '@/utils/dbConnect';
import OrderModel, { Order } from 'models/Order';
import UserModel, { User } from 'models/User';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { getQueryElements } from '@/utils/getQueryElements';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && user) {
          const {
            search,
            filters: filtersQuery,
            byUserId,
            byUserEmail,
            offset,
            limit,
          } = getQueryElements(req.query);

          const matchFilter: {
            status?: [
              processing?: 'processing',
              inDelivery?: 'inDelivery',
              canceled?: 'canceled',
              completed?: 'completed',
            ];
          } = {
            status: [],
          };
          const sortFilter: { orderedAt?: -1 | 1 } = {};

          if (filtersQuery) {
            const filters = Object.fromEntries(
              filtersQuery.split(' ').map((f) => [f, true]),
            );

            if (filters.processing) matchFilter.status?.push('processing');
            if (filters.inDelivery) matchFilter.status?.push('inDelivery');
            if (filters.canceled) matchFilter.status?.push('canceled');
            if (filters.completed) matchFilter.status?.push('completed');

            if (filters.lastOrdered) sortFilter.orderedAt = -1;
            else if (filters.firstOrdered) sortFilter.orderedAt = 1;
          }

          if (!matchFilter.status?.length) delete matchFilter.status;

          const options = {
            limit: +limit || 3,
            skip: +offset || 0,
            sort: sortFilter,
          };

          if (byUserId) {
            const dbOrders: Order[] = await OrderModel.find(
              {
                ...matchFilter,
                user: user._id,
              },
              'number items total_price status orderedAt completedAt',
              options,
            ).lean();

            if (dbOrders.length) {
              const count: number = await OrderModel.countDocuments({
                ...matchFilter,
                user: user._id,
              });

              res.status(200).json({ success: true, orders: dbOrders, count });
            } else {
              res.status(400).json({ success: false, message: 'Not Found' });
            }
          } else if (user.isAdmin || user.isManager) {
            if (search) {
              if (byUserEmail) {
                const { email } = await validator.validateEmail({
                  email: search,
                });

                const dbUser: User = await UserModel.findOne(
                  { email },
                  '_id',
                ).lean();

                if (!dbUser)
                  validator.throwValidationError({
                    message: 'utilizatorul cu acest email nu există',
                    key: 'email',
                  });

                const dbOrders: Order[] = await OrderModel.find(
                  {
                    ...matchFilter,
                    user: dbUser._id,
                  },
                  null,
                  options,
                )
                  .populate({
                    path: 'user',
                    select: 'name email',
                  })
                  .lean();

                if (dbOrders.length) {
                  const count: number = await OrderModel.countDocuments({
                    ...matchFilter,
                    user: dbUser._id,
                  });

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
                  number: search,
                });

                const dbOrder: Order = await OrderModel.findOne({ number })
                  .populate({
                    path: 'user',
                    select: 'name email',
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
              const dbOrders: Order[] = await OrderModel.find(
                matchFilter,
                null,
                options,
              )
                .populate({
                  path: 'user',
                  select: 'name email',
                })
                .lean();

              if (dbOrders.length) {
                const count: number = await OrderModel.countDocuments(
                  matchFilter,
                );

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
