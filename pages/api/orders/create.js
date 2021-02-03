import dbConnect from '@/utils/dbConnect';
import Product from 'models/Product';
import Order from 'models/Order';
import { withSession } from '@/utils/withSession';
import * as validator from '@/utils/validator';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNQPRST1234567890', 16);

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      try {
        const { isAuth, user } = req.session;

        if (isAuth) {
          const info = await validator.validateOrderSubmit(req.body.info);
          const items = await validator.validateOrderItems(req.body.items);

          const dbProducts = await Promise.all(
            items.map((item) =>
              Product.findById(item.product_id, 'name price quantity').lean()
            )
          );

          if (!dbProducts.length || dbProducts.includes(null))
            throw new Error('corrupt cart');

          const orderItems = items.map(({ product_id, count }) => {
            const dbProduct = dbProducts.find(
              (p) => p._id.toString() === product_id
            );

            return {
              count,
              product: {
                price: dbProduct.price * count,
                quantity: dbProduct.quantity * count,
                name: dbProduct.name
              }
            };
          });

          const totalPrice = orderItems.reduce(
            (total, { product: { price } }) => total + price,
            0
          );

          const number = await nanoid();

          const order = new Order({
            user: user._id,
            total_price: totalPrice,
            items: orderItems,
            ...info,
            number
          });

          await order.save();

          res.status(201).json({
            success: true,
            message: `comanda cu nr. ${number} a fost trimisă, un operator vă va contacta încurând.`
          });
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      } catch (error) {
        console.log(error);
        const details = validator.getValidationErrorDetails(error);

        console.log(details);

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
