import dbConnect from '@/utils/dbConnect';
import { withSessionApi } from '@/utils/withSession';
import { promises as fs } from 'fs';
import FormidableParser from '@/utils/FormidableParser';
import ProductService from 'services/ProductService';
import CategoryService from 'services/CategoryService';
import { Product } from '@/models/Product';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'POST':
      await handlePost(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['POST'], req.method);

      break;
  }
});

// Formidable will handle
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Create product (optionally storing img)
 */
const handlePost = async (
  routeService: ApiRouteService<{ product?: Product }>,
) => {
  try {
    // respond 401 Unauthorized if user is not authorized
    // respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    // get product form data
    const { fields, files } = await FormidableParser.handleProductForm(
      routeService.req,
      {
        maxFileSize: 1 * 1024 * 1024,
        multiples: false,
      },
      ['jpg', 'png', 'jpeg'],
    );

    // set src file if exists
    if (files.src && files.src.name) {
      const data = await fs.readFile(files.src.path);

      fields.src = `data:${files.src.type};base64,${Buffer.from(data).toString(
        'base64',
      )}`;
    }

    // respond 400 Validation Error if name is invalid
    // respond 400 Validation Error if product exists
    await ProductService.throwIfProductExists(fields.name);

    // respond 400 Validation Error if category doesn't exist
    const dbCategory = await CategoryService.findCategoryById(
      fields.category_id,
    );

    // create new product
    // respond 400 Validation Error if data is invalid
    const dbProduct = await ProductService.createProduct(fields);

    // add product to category
    // respond 400 Validation Error if category doesn't exist
    await CategoryService.addProductToCategory(dbCategory._id, dbProduct._id);

    routeService.resCreated({ product: dbProduct });
  } catch (error) {
    console.error(error);

    routeService.handleApiError(error);
  }
};
