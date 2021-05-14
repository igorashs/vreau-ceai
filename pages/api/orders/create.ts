import dbConnect from '@/utils/dbConnect';
// import ProductModel, { Product } from 'models/Product';
// import OrderModel, { Order } from 'models/Order';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
// import { customAlphabet } from 'nanoid';
import { ApiResponse, OrderItem, OrderSubmit } from 'types';
import ProductService from 'services/ProductService';
import OrderService from 'services/OrderService';

// const nanoid = customAlphabet('ABCDEFGHIJKLMNQPRST1234567890', 16);

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { isAuth, user } = req.session;

        // respond 401 Unauthorized if user is not authenticated
        if (!isAuth || !user) {
          res.status(401).json({ success: false, message: 'Unauthorized' });

          return;
        }

        const {
          info: bodyInfo,
          items: bodyItems,
        }: { info: OrderSubmit; items: OrderItem[] } = req.body;

        // respond 400 Validation Errors if the data is invalid
        // respond 400 Bad Request if the cart is corrupt
        const { items, total_price } = await ProductService.getCart(bodyItems);

        // respond 400 Validation Error if data is invalid
        const { number } = await OrderService.createOrder({
          user: user._id,
          items,
          total_price,
          bodyInfo,
        });

        res.status(201).json({
          success: true,
          message: `comanda cu nr. ${number} a fost trimisă, un operator vă va contacta încurând.`,
        });
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
