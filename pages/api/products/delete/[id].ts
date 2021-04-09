import dbConnect from '@/utils/dbConnect';
import ProductModel, { Product } from 'models/Product';
import CategoryModel from 'models/Category';
import { withSessionApi } from '@/utils/withSession';
import { promises as fs } from 'fs';
import { getQueryElements } from '@/utils/getQueryElements';
import { ApiResponse } from 'types';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        if (isAuth && (user?.isAdmin || user?.isManager)) {
          const { id } = getQueryElements(req.query);

          const dbProduct: Product = await ProductModel.findByIdAndDelete(id, {
            projection: 'src category_id',
          });

          if (dbProduct) {
            // remove from prev category product list
            await CategoryModel.findByIdAndUpdate(
              dbProduct.category_id,
              { $pull: { products: dbProduct._id } },
              { projection: 'name' },
            );

            if (dbProduct.src !== 'placeholder.png')
              await fs.unlink(
                `${process.cwd()}/public/uploads/${dbProduct.src}`,
              );

            res.status(200).json({ success: true, message: 'Success' });
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
