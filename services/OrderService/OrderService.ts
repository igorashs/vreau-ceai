import { Order } from '@/models/Order';
import { Model, QueryOptions } from 'mongoose';
import { OrderMatchFilter, OrderStatus, OrderSubmit } from 'types';
import { customAlphabet } from 'nanoid';
import * as validator from '@/utils/validator';

const nanoid = customAlphabet('ABCDEFGHIJKLMNQPRST1234567890', 16);

const queryOrdersByUserId = (OrderModel: Model<Order>) =>
  /**
   * Query orders by user Id with specified filters
   *
   * @returns Orders[] | []
   */

  (
    _id: string,
    matchFilter: OrderMatchFilter,
    fields: string | null,
    options: QueryOptions,
  ) => {
    return OrderModel.find(
      {
        status: { $in: matchFilter.status },
        user: _id,
      },
      fields,
      options,
    );
  };

const countOrdersByUserId = (OrderModel: Model<Order>) =>
  /**
   * Count orders by user Id with specified filters
   *
   * @returns count
   */

  (_id: string, matchFilter: OrderMatchFilter) => {
    return OrderModel.countDocuments({
      status: { $in: matchFilter.status },
      user: _id,
    });
  };

const queryOrder = (OrderModel: Model<Order>) =>
  /**
   * Query order
   * * `Populate user: 'name email'`
   * * Throw ValidationError if number is invalid
   *
   * @returns Order | null
   */
  async (number: string) => {
    const values = await validator.validateOrderNumber({ number });

    return OrderModel.findOne({ number: values.number }).populate({
      path: 'user',
      select: 'name email',
    });
  };

const listOrders = (OrderModel: Model<Order>) =>
  /**
   * List all orders with specified filters
   *
   * @returns Order[] | []
   */
  (
    matchFilter: OrderMatchFilter,
    fields: string | null,
    options: QueryOptions,
  ) => {
    return OrderModel.find(
      { status: { $in: matchFilter.status } },
      fields,
      options,
    );
  };

const listOrdersByUserId = (OrderModel: Model<Order>) =>
  /**
   * List orders by user Id with specified filters
   *
   * @returns Order[] | []
   */
  (
    _id: string,
    matchFilter: OrderMatchFilter,
    fields: string | null,
    options: QueryOptions,
  ) => {
    return OrderModel.find(
      {
        status: { $in: matchFilter.status },
        user: _id,
      },
      fields,
      options,
    );
  };

const countOrders = (OrderModel: Model<Order>) =>
  /**
   * Count orders with specified filters
   *
   * @returns count
   */

  (matchFilter: OrderMatchFilter) => {
    return OrderModel.countDocuments({ status: { $in: matchFilter.status } });
  };

const createOrder = (OrderModel: Model<Order>) =>
  /**
   * Create order for user with specified data
   *
   * * Throw ValidationError if data is invalid
   *
   * @returns \{Order, number} (order number)
   */
  async ({
    user,
    total_price,
    items,
    bodyInfo,
  }: {
    user: string;
    total_price: number;
    items: Order['items'];
    bodyInfo: OrderSubmit;
  }) => {
    const number = await nanoid();
    const info = await validator.validateOrderSubmit(bodyInfo);

    const dbOrder = new OrderModel({
      user,
      total_price,
      items,
      ...info,
      number,
    });

    await dbOrder.save();

    return { number, dbOrder };
  };

const updateOrder = (OrderModel: Model<Order>) =>
  /**
   * Update order with provided status
   *
   * * `Completed order is not updated`
   * * `Populate user: 'name email'`
   * * `Add completion data on completed status`
   * * Throw ValidationError if status is invalid
   *
   * @returns \{Order | null, modified} (updated order and modified: if status was modified)
   */
  async (_id: string, status: OrderStatus['status']) => {
    const values = await validator.validateOrderStatus({
      status,
    });

    // populate user
    const dbOrder = await OrderModel.findById(_id).populate({
      path: 'user',
      select: 'name email',
    });

    let modified = false;

    // cannot update completed order
    if (dbOrder && dbOrder.status !== 'completed') {
      dbOrder.status = values.status;

      // add date completion
      if (values.status === 'completed') dbOrder.completedAt = new Date();
      await dbOrder.save();
      modified = true;
    }

    return { dbOrder, modified };
  };

const deleteOrder = (OrderModel: Model<Order>) =>
  /**
   * Delete order
   *
   * @returns Order | null
   */
  (_id: string) => {
    return OrderModel.findByIdAndDelete(_id, {
      projection: '_id',
    });
  };

const deleteUserOrder = (OrderModel: Model<Order>) =>
  /**
   * Delete user order
   *
   * * `Delete order if is completed | canceled`
   *
   * @returns Order | null
   */
  async (_id: string, user_id: string) => {
    const dbOrder = await OrderModel.findById(_id, 'status user');

    if (
      dbOrder &&
      dbOrder.user.toString() === user_id &&
      (dbOrder.status === 'completed' || dbOrder.status === 'canceled')
    ) {
      return OrderModel.findByIdAndDelete(_id, {
        projection: '_id',
      });
    }

    return null;
  };

export default (OrderModel: Model<Order>) => ({
  queryOrdersByUserId: queryOrdersByUserId(OrderModel),
  countOrdersByUserId: countOrdersByUserId(OrderModel),
  listOrdersByUserId: listOrdersByUserId(OrderModel),
  deleteUserOrder: deleteUserOrder(OrderModel),
  countOrders: countOrders(OrderModel),
  createOrder: createOrder(OrderModel),
  updateOrder: updateOrder(OrderModel),
  deleteOrder: deleteOrder(OrderModel),
  listOrders: listOrders(OrderModel),
  queryOrder: queryOrder(OrderModel),
});
