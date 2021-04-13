import TextField from '@/shared/TextField';
import Button from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { nameSchema } from '@/utils/validator/schemas/product';
import Form, { FormAction } from '@/shared/Form';
import { ProductName, ProductNameErrorDetail } from 'types';

type FindProductFormProps = {
  onFindProductSubmit: (
    data: ProductName,
  ) => Promise<ProductNameErrorDetail[] | undefined>;
};

const FindProductForm = ({ onFindProductSubmit }: FindProductFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductName>({
    mode: 'onChange',
    resolver: joiResolver(nameSchema),
  });

  const onSubmit = async (data: ProductName) => {
    const submitErrors = await onFindProductSubmit(data);

    if (submitErrors) {
      submitErrors.forEach((error) => {
        const { message, name } = error;
        if (name) setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="numele produsului"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>caută</Button>
      </FormAction>
    </Form>
  );
};

export default FindProductForm;
