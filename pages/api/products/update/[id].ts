import dbConnect from '@/utils/dbConnect';
import { Product } from 'models/Product';
import { withSessionApi } from '@/utils/withSession';
import { promises as fs } from 'fs';
import FormidableParser from '@/utils/FormidableParser';
import generateUniqueFileName from '@/utils/generateUniqueFileName';
import CategoryService from 'services/CategoryService';
import ProductService from 'services/ProductService';
import ApiRouteService from 'services/ApiRouteService';

export default withSessionApi(async function handler(req, res) {
  await dbConnect();
  const routeService = new ApiRouteService(req, res);

  switch (req.method) {
    case 'PUT':
      await handlePut(routeService);

      break;

    default:
      routeService.resMethodNotAllowed(['PUT'], req.method);

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
 * Update product (optionally storing new img | deleting old one)
 */
const handlePut = async (
  routeService: ApiRouteService<{ product?: Product }>,
) => {
  let tmpSrc;

  try {
    // respond 401 Unauthorized if user is not authorized
    // respond 403 Forbidden if user doesn't have required permissions
    if (!routeService.isAuthorized({ isManager: true })) return;

    const { id } = routeService.getQuery();

    // TODO Images API, (Store Images in MongoDB)
    // get product form data
    const { fields, files } = await FormidableParser.handleProductForm(
      routeService.req,
      {
        uploadDir: `${process.cwd()}/public/uploads`,
        maxFileSize: 1 * 1024 * 1024,
        multiples: false,
      },
      ['jpg', 'png', 'jpeg'],
    );

    // set src file if exists
    if (files.src && files.src.name) {
      // create unique file name
      fields.src = generateUniqueFileName(files.src.name);

      // store name for unexpected errors
      tmpSrc = fields.src;
    }

    // find existing product
    // respond 400 Validation Error if product doesn't exist
    const dbExistingProduct = await ProductService.findProductById(id);

    // if the name is not changed
    if (fields.name !== dbExistingProduct.name)
      // respond with 400 Validation Error if product name is already used
      await ProductService.throwIfProductExists(fields.name);

    // ? changeProductCategory ?
    // handle category change
    if (
      fields.category_id &&
      dbExistingProduct.category_id.toString() !== fields.category_id
    ) {
      // add product to the new category
      // respond 400 Validation Error if product doesn't exist
      await CategoryService.addProductToCategory(
        fields.category_id,
        dbExistingProduct._id,
      );

      // delete product from previous category
      await CategoryService.deleteProductFromCategory(
        dbExistingProduct.category_id.toString(),
        dbExistingProduct._id,
      );
    }

    // hard coded :)
    const defaultImg = 'placeholder.png';
    const newImg = fields.src;

    // if new img was provided and prevImg isn't default img
    if (newImg && dbExistingProduct.src !== defaultImg) {
      // delete prevImg
      await fs.unlink(
        `${process.cwd()}/public/uploads/${dbExistingProduct.src}`,
      );
      // if prevImg isn't default img
    } else if (dbExistingProduct.src !== defaultImg) {
      // use prevImg
      fields.src = dbExistingProduct.src;
    }

    // rename product img if new img was provided
    if (files.src) {
      await fs.rename(
        files.src.path,
        `${process.cwd()}/public/uploads/${fields.src}`,
      );
    }

    // update product and return updatedProduct
    // respond 400 Validation Error if data is invalid
    // respond 400 Validation Error if product doesn't exist
    const dbUpdatedProduct = await ProductService.updateProduct(id, fields, {
      new: true,
    });

    if (dbUpdatedProduct) {
      routeService.resOk({ product: dbUpdatedProduct });
    } else {
      routeService.resNotFound();
    }
  } catch (error) {
    try {
      // remove temp img if something went wrong
      if (tmpSrc) await fs.unlink(tmpSrc);
    } catch (fsError) {
      // console.error(error);
    }

    routeService.handleApiError(error);
  }
};
