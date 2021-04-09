import dbConnect from '@/utils/dbConnect';
import ProductModel, { Product } from 'models/Product';
import OrderModel, { Order } from 'models/Order';
import { withSessionApi } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { customAlphabet } from 'nanoid';
import { ApiResponse, OrderItem, OrderSubmit } from 'types';

const nanoid = customAlphabet('ABCDEFGHIJKLMNQPRST1234567890', 16);

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && user) {
          const {
            info: bodyInfo,
            items: bodyItems,
          }: { info: OrderSubmit; items: OrderItem[] } = req.body;

          const info = await validator.validateOrderSubmit(bodyInfo);
          const items = await validator.validateOrderItems(bodyItems);

          const dbProducts: (Product | null)[] = await Promise.all(
            items.map((item) =>
              ProductModel.findById(
                item.product_id,
                'name price quantity',
              ).lean(),
            ),
          );

          if (!dbProducts.length || dbProducts.includes(null))
            throw new Error('corrupt cart');

          const orderItems = items.map(({ product_id, count }) => {
            const dbProduct = dbProducts.find(
              (p) => p?._id.toString() === product_id,
            );

            if (!dbProduct) throw new Error('corrupt cart');

            return {
              count,
              product: {
                price: dbProduct.price * count,
                quantity: dbProduct.quantity * count,
                name: dbProduct.name,
              },
            };
          });

          const totalPrice = orderItems.reduce(
            (total, { product: { price } }) => total + price,
            0,
          );

          const number = await nanoid();

          const order: Order = new OrderModel({
            user: user._id,
            total_price: totalPrice,
            items: orderItems,
            ...info,
            number,
          });

          await order.save();

          res.status(201).json({
            success: true,
            message: `comanda cu nr. ${number} a fost trimisă, un operator vă va contacta încurând.`,
          });
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
