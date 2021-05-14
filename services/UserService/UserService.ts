import { Model } from 'mongoose';
import { User } from '@/models/User';
import * as validator from '@/utils/validator';
import { UserLogin, UserSignup } from 'types';
import { userMessages } from '@/utils/validator/schemas/user';
import bcrypt from 'bcrypt';

/*
 * find..   - throw error if data is not found
 * query..  - return null if data is not found
 */

const queryUser = (UserModel: Model<User>) =>
  /**
   *  Query user
   *
   * * Throw ValidationError if email is invalid
   *
   * @returns User | null
   *
   */
  async (email: string, fields?: string) => {
    const values = await validator.validateEmail({
      email,
    });

    return UserModel.findOne({ email: values.email }, fields);
  };

const findUser = (UserModel: Model<User>) =>
  /**
   * Find user
   *
   * * Throw ValidationError if user doesn't exist
   * * Throw ValidationError if email is invalid
   *
   * @returns User
   */
  async (email: string, fields?: string) => {
    const values = await validator.validateEmail({
      email,
    });

    const dbUser = await UserModel.findOne({ email: values.email }, fields);

    if (!dbUser)
      return validator.throwValidationError({
        message: userMessages.email.unknown,
        key: 'email',
      });

    return dbUser;
  };

const queryUserById = (UserModel: Model<User>) =>
  /**
   * Query user by id
   *
   * @returns User | null
   */
  (_id: string, fields?: string) => UserModel.findById(_id, fields);

const loginUser = (UserModel: Model<User>) =>
  /**
   * Login user
   *
   * * Throw ValidationError if data is invalid
   * * Throw ValidationError if user with specified email doesn't exist
   * * Throw ValidationError if passwords don't match
   *
   * @returns User
   */
  async ({ email, password }: UserLogin) => {
    const values = await validator.validateUserLogin({ email, password });
    const dbUser = await UserModel.findOne(
      { email: values.email },
      'name isAdmin isManager password',
    );

    if (!dbUser)
      return validator.throwValidationError({
        message: userMessages.email.unknown,
        key: 'email',
      });

    const match = await bcrypt.compare(values.password, dbUser.password);

    if (!match)
      return validator.throwValidationError({
        message: userMessages.password.wrong,
        key: 'password',
      });

    return dbUser;
  };

const signupUser = (UserModel: Model<User>) =>
  /**
   * Create user with hashed pass
   *
   * * Throw ValidationError if data is invalid
   * * Throw ValidationError if a user if specified email already exists
   *
   * @returns User
   */
  async ({ name, email, password, repeat_password }: UserSignup) => {
    const values = await validator.validateUserSignup({
      name,
      email,
      password,
      repeat_password,
    });

    const dbUser = await UserModel.findOne({ email: values.email }, 'email');

    if (dbUser)
      return validator.throwValidationError({
        message: userMessages.email.exists,
        key: 'email',
      });

    const hashedPass = await bcrypt.hash(
      values.password,
      +(process.env.SALT as string),
    );

    const newUser = new UserModel({
      ...values,
      password: hashedPass,
    });

    await newUser.save();

    return newUser;
  };

const updateUserPermission = (UserModel: Model<User>) =>
  /**
   * Query user by id and update permission
   *
   * * Throw ValidationError if data is invalid
   *
   * @returns User | null
   */
  async (
    _id: string,
    { isManager }: { isManager: boolean },
    fields?: string,
  ) => {
    if (typeof isManager !== 'boolean')
      return validator.throwValidationError({
        message: userMessages.isManager.invalid,
        key: 'isManager',
      });

    const dbUser = await UserModel.findById(_id, fields);

    if (dbUser) {
      dbUser.isManager = isManager;
      await dbUser.save();
    }

    return dbUser;
  };

export default (UserModel: Model<User>) => ({
  queryUser: queryUser(UserModel),
  findUser: findUser(UserModel),
  loginUser: loginUser(UserModel),
  signupUser: signupUser(UserModel),
  queryUserById: queryUserById(UserModel),
  updateUserPermission: updateUserPermission(UserModel),
});
