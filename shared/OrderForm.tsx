import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { orderStatusSchema } from '@/utils/validator/schemas/order';
import { Form, FormAction } from '@/shared/Form';
import { Select } from '@/shared/Select';
import Button from '@/shared/Button';
import { useEffect } from 'react';
import { OrderStatus } from 'types';

type InputsErrors = { message: string; name: 'status' }[];

interface OrderFormProps {
  onOrderSubmit: (data: OrderStatus) => InputsErrors;
  order?: OrderStatus & {
    _id: string;
  };
}

export const OrderForm = ({ onOrderSubmit, order }: OrderFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<OrderStatus>({
    mode: 'onChange',
    resolver: joiResolver(orderStatusSchema),
  });

  useEffect(() => {
    reset({
      status: order?.status,
    });
  }, [order]);

  const onSubmit = async (data: OrderStatus) => {
    const submitErrors = await onOrderSubmit(data);

    if (submitErrors) {
      submitErrors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormAction justify="space-between" align="flex-end">
        <Select
          id={order && `order_id_${order._id}`}
          name="status"
          label="status"
          passRef={register}
          error={errors?.status?.message}
          disabled={order?.status === 'completed'}
        >
          <option value="processing">procesare</option>
          <option value="inDelivery">în livrare</option>
          <option value="canceled">anulată</option>
          <option value="completed">finalizată</option>
        </Select>

        <Button disabled={order?.status === 'completed'}>salvează</Button>
      </FormAction>
    </Form>
  );
};
