import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import { getQueryElements } from '@/utils/getQueryElements';
import { ApiResponse } from 'types';
import ProductService from 'services/ProductService';
import CategoryService from 'services/CategoryService';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'DELETE':
      try {
        const { isAuth, user } = req.session;

        // respond 401 Unauthorized if user doesn't have permission
        if (!isAuth || (!user?.isAdmin && !user?.isManager)) {
          res.status(401).json({ success: false, message: 'Unauthorized' });

          return;
        }

        const { id } = getQueryElements(req.query);
        const deletedProduct = await ProductService.deleteProduct(id);

        if (deletedProduct) {
          // remove from prev category product list
          await CategoryService.deleteProductFromCategory(
            deletedProduct.category_id.toString(),
            deletedProduct._id,
          );

          res.status(200).json({ success: true, message: 'Success' });
        } else {
          res.status(404).json({ success: false, message: 'Not Found' });
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
