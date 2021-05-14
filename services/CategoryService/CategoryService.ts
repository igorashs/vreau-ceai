import { Model, QueryOptions } from 'mongoose';
import { Category } from '@/models/Category';
import * as validator from '@/utils/validator';
import { categoryMessages } from '@/utils/validator/schemas/category';
import { ProductMatchFilter } from 'types';
import { Product } from '@/models/Product';

const queryCategory = (CategoryModel: Model<Category>) =>
  /**
   * Query category
   *
   * * Throw ValidationError if name is invalid
   *
   * @returns Category | null
   */
  async (name: string) => {
    const values = await validator.validateCategory({
      name,
    });

    return CategoryModel.findOne({
      name: values.name,
    });
  };

const listCategories = (CategoryModel: Model<Category>) =>
  /**
   *  List all categories
   *
   * @returns Category[] | []
   */
  () => CategoryModel.find({});

const createCategory = (CategoryModel: Model<Category>) =>
  /**
   * Create new category
   *
   * * Throw ValidationError if name is invalid
   * * Throw ValidationError if category with provided name already exists
   *
   * @returns Category
   */

  async (name: string) => {
    const values = await validator.validateCategory({ name });
    const dbCategory = await CategoryModel.findOne({
      name: values.name,
    });

    if (dbCategory)
      return validator.throwValidationError({
        message: categoryMessages.name.exists,
        key: 'name',
      });

    const newCategory = new CategoryModel({ name: values.name });
    await newCategory.save();

    return newCategory;
  };

const updateCategory = (CategoryModel: Model<Category>) =>
  /**
   * Update category
   *
   * * Throw ValidationError if name is invalid
   * * Throw ValidationError if category with provided name already exists
   * * Throw ValidationError if category to update doesn't exist
   *
   * @returns updated Category
   */
  async (_id: string, name: string) => {
    const values = await validator.validateCategory({ name });
    const dbCategory = await CategoryModel.findOne(
      { name: values.name },
      'name',
    );

    if (dbCategory)
      return validator.throwValidationError({
        message: categoryMessages.name.exists,
        key: 'name',
      });

    const dbCategoryToUpdate = await CategoryModel.findById(_id, 'name');

    if (!dbCategoryToUpdate)
      return validator.throwValidationError({
        message: categoryMessages.name.wrong,
        key: 'name',
      });

    dbCategoryToUpdate.name = values.name;
    await dbCategoryToUpdate.save();

    return dbCategoryToUpdate;
  };

const deleteCategory = (CategoryModel: Model<Category>) =>
  /**
   * Delete category
   *
   * @returns deleted Category
   */
  (_id: string) => CategoryModel.findByIdAndDelete(_id);

const queryCategoryWithProducts = (CategoryModel: Model<Category>) =>
  /**
   * Query category
   *
   * * `Populate products: with specified filters`
   * * Throw ValidationError if name is invalid
   *
   * @returns Category | null
   */
  async (
    name: string,
    matchFilter: ProductMatchFilter,
    productOptions: QueryOptions,
  ) => {
    const values = await validator.validateCategory({
      name,
    });

    const dbCategory = await CategoryModel.findOne({
      name: values.name,
    }).populate({
      path: 'products',
      match: matchFilter,
      options: productOptions,
    });

    return dbCategory as null | (Category & { products: Product[] });
  };

const deleteProductFromCategory = (CategoryModel: Model<Category>) =>
  /**
   * Delete product from category
   *
   * @returns Category | null
   */
  (category_id: string, product_id: string) => {
    return CategoryModel.findByIdAndUpdate(
      category_id,
      { $pull: { products: product_id } },
      { projection: 'name' },
    );
  };

const addProductToCategory = (CategoryModel: Model<Category>) =>
  /**
   * Add product to category
   *
   * * Throw ValidationError if category doesn't exist
   *
   * @returns Category
   */

  async (category_id?: string, product_id?: string) => {
    const dbCategory = CategoryModel.findByIdAndUpdate(
      category_id,
      { $push: { products: product_id } },
      { projection: 'name' },
    );

    if (!dbCategory)
      return validator.throwValidationError({
        message: categoryMessages.name.wrong,
        key: 'category',
      });

    return dbCategory;
  };

const findCategoryById = (CategoryModel: Model<Category>) =>
  /**
   * Find category by Id
   *
   * * Throw ValidationError if category doesn't exist
   *
   * @returns Category
   */
  async (_id?: string, fields?: string) => {
    const dbCategory = await CategoryModel.findById(_id, fields);

    if (!dbCategory)
      return validator.throwValidationError({
        message: categoryMessages.name.wrong,
        key: 'name',
      });

    return dbCategory;
  };

export default (CategoryModel: Model<Category>) => ({
  queryCategoryWithProducts: queryCategoryWithProducts(CategoryModel),
  deleteProductFromCategory: deleteProductFromCategory(CategoryModel),
  addProductToCategory: addProductToCategory(CategoryModel),
  findCategoryById: findCategoryById(CategoryModel),
  listCategories: listCategories(CategoryModel),
  createCategory: createCategory(CategoryModel),
  updateCategory: updateCategory(CategoryModel),
  deleteCategory: deleteCategory(CategoryModel),
  queryCategory: queryCategory(CategoryModel),
});
