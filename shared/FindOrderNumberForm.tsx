import { TextField } from '@/shared/TextField';
import Button from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { orderNumberSchema } from '@/utils/validator/schemas/order';
import { Form, FormAction } from '@/shared/Form';
import { OrderNumber } from 'types';

type InputsErrors = { message: string; name: 'number' }[];

interface FindOrderNumberFormProps {
  onFindOrderSubmit: (data: OrderNumber) => InputsErrors;
}

export const FindOrderNumberForm = ({
  onFindOrderSubmit,
}: FindOrderNumberFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(orderNumberSchema),
  });

  const onSubmit = async (data: OrderNumber) => {
    const submitErrors = await onFindOrderSubmit(data);

    if (submitErrors) {
      submitErrors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="number"
        label="numărul comenzii"
        error={errors?.number?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>caută</Button>
      </FormAction>
    </Form>
  );
};
