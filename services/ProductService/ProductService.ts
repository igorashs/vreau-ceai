import { Model, QueryOptions } from 'mongoose';
import { Product } from '@/models/Product';
import { OrderItem, ProductFields, ProductMatchFilter } from 'types';
import { promises as fs } from 'fs';
import * as validator from '@/utils/validator';
import { productMessages } from '@/utils/validator/schemas/product';

const getCart = (ProductModel: Model<Product>) =>
  /**
   * Get filled cart with items and prices
   *
   * * Throw ValidationError if ordered items are invalid
   * * Throw Error if cart includes invalid products
   * * ?Throw Error if cart product doesn't match with db product
   *
   * @returns \{orderItems, total_price}
   */
  async (bodyItems: OrderItem[]) => {
    const items = await validator.validateOrderItems(bodyItems);

    // find all products
    const dbProducts = await Promise.all(
      items.map((item) =>
        ProductModel.findById(item.product_id, 'name price quantity').lean(),
      ),
    );

    if (!dbProducts.length || dbProducts.includes(null))
      throw new Error('corrupt cart');

    // validate user products with db products
    const orderItems = items.map(({ product_id, count }) => {
      const dbProduct = dbProducts.find(
        (p) => p?._id.toString() === product_id,
      );

      // ? is this check necessary?
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

    // get total price
    const totalPrice = orderItems.reduce(
      (total, { product: { price } }) => total + price,
      0,
    );

    return {
      items: orderItems,
      total_price: totalPrice,
    };
  };

const countProductsByCategoryId = (ProductModel: Model<Product>) =>
  /**
   * Count products by category id with specified filters
   *
   * @returns count
   */
  (_id: string, matchFilter: ProductMatchFilter) => {
    return ProductModel.countDocuments({
      ...matchFilter,
      category_id: _id,
    });
  };

const queryProduct = (ProductModel: Model<Product>) =>
  /**
   *  Query product
   *
   * * Throw ValidationError if name is invalid
   *
   * @returns Product | null
   */
  async (name: string) => {
    const values = await validator.validateProductName({
      name,
    });

    return ProductModel.findOne({ name: values.name });
  };

const listProducts = (ProductModel: Model<Product>) =>
  /**
   * List all products with specified filters
   *
   * @returns Products[] | []
   */
  (
    matchFilter: ProductMatchFilter,
    fields: string | null,
    options: QueryOptions,
  ) => {
    return ProductModel.find(matchFilter, fields, options);
  };

const listRecommendedProducts = (ProductModel: Model<Product>) =>
  /**
   *  List all recommended products
   *
   *  * `Populate category: 'name'`
   *
   * @returns Products[] | []
   */
  (options: QueryOptions) => {
    return ProductModel.find({ recommend: true }, null, options).populate({
      path: 'category_id',
      select: 'name',
    });
  };

const countProducts = (ProductModel: Model<Product>) =>
  /**
   * Count products with specified filters
   *
   * @returns count
   */
  (matchFilter: ProductMatchFilter) => {
    return ProductModel.countDocuments(matchFilter);
  };

const deleteProduct = (ProductModel: Model<Product>) =>
  /**
   * Delete product and product img if exists
   *
   * @returns deleted product
   */
  async (_id: string) => {
    const dbProduct = await ProductModel.findByIdAndDelete(_id, {
      projection: 'src category_id',
    });

    if (dbProduct && dbProduct.src !== 'placeholder.png')
      await fs.unlink(`${process.cwd()}/public/uploads/${dbProduct.src}`);

    return dbProduct;
  };

const throwIfProductExists = (ProductModel: Model<Product>) =>
  /**
   * Query a product and throw an error if product exists
   *
   * * Throw ValidationError if product exists
   * * Throw ValidationError if name is invalid
   */
  async (name?: string) => {
    const values = await validator.validateProductName({
      name,
    });

    const dbProduct = await ProductModel.findOne({ name: values.name });

    if (dbProduct)
      validator.throwValidationError({
        message: productMessages.name.exists,
        key: 'name',
      });
  };

const createProduct = (ProductModel: Model<Product>) =>
  /**
   * Create product
   *
   * * Throw ValidationError if data is invalid
   *
   * @returns created Product
   */
  async (productFields: Partial<ProductFields>) => {
    const values = await validator.validateProduct(productFields);
    const newProduct = new ProductModel(values);

    await newProduct.save();

    return newProduct;
  };

const findProductById = (ProductModel: Model<Product>) =>
  /**
   * Find product by Id
   *
   * * Throw ValidationError if product doesn't exist
   *
   * @returns Product
   */
  async (_id: string) => {
    const dbProduct = await ProductModel.findById(_id);

    if (!dbProduct)
      return validator.throwValidationError({
        message: productMessages.name.wrong,
        key: 'name',
      });

    return dbProduct;
  };

const updateProduct = (ProductModel: Model<Product>) =>
  /**
   * Update product
   *
   * * Throw ValidationError if data is invalid
   * * Throw ValidationError if product doesn't exist
   *
   * @returns updated Product
   */
  async (
    _id: string,
    productFields: Partial<ProductFields>,
    options?: QueryOptions,
  ) => {
    const values = await validator.validateProduct(productFields);
    const dbProduct = await ProductModel.findByIdAndUpdate(
      _id,
      values,
      options,
    );

    if (!dbProduct)
      return validator.throwValidationError({
        message: productMessages.name.wrong,
        key: 'name',
      });

    return dbProduct;
  };

export default (ProductModel: Model<Product>) => ({
  countProductsByCategoryId: countProductsByCategoryId(ProductModel),
  listRecommendedProducts: listRecommendedProducts(ProductModel),
  throwIfProductExists: throwIfProductExists(ProductModel),
  findProductById: findProductById(ProductModel),
  countProducts: countProducts(ProductModel),
  deleteProduct: deleteProduct(ProductModel),
  createProduct: createProduct(ProductModel),
  updateProduct: updateProduct(ProductModel),
  listProducts: listProducts(ProductModel),
  queryProduct: queryProduct(ProductModel),
  getCart: getCart(ProductModel),
});
