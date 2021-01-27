import dbConnect from '@/utils/dbConnect';
import Product from 'models/Product';
import { withSession } from '@/utils/withSession';

export default withSession(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user.isAdmin || user.isManager)) {
          const { id } = req.query;

          const dbProduct = await Product.findByIdAndDelete(id);

          if (dbProduct) {
            res.status(200).json({ success: true, message: 'Product deleted' });
          } else {
            res.status(404).json({ success: false, message: 'Not Found' });
          }
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request' });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });

      break;
  }
});
