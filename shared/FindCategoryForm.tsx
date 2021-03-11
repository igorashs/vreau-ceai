import { TextField } from '@/shared/TextField';
import Button from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import { Form, FormAction } from '@/shared/Form';

type CategoryInputs = {
  name: string;
};

type InputsErrors = Array<{ message: string; name: 'name' }>;

interface FindCategoryFormProps {
  onFindCategorySubmit: (data: CategoryInputs) => Promise<InputsErrors | null>;
}

export function FindCategoryForm({
  onFindCategorySubmit,
}: FindCategoryFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryInputs) => {
    const submitErrors = await onFindCategorySubmit(data);

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
        name="name"
        label="numele categoriei"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>caută</Button>
      </FormAction>
    </Form>
  );
}
