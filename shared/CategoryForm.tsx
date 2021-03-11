import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import { Form, FormAction } from '@/shared/Form';
import { TextField } from '@/shared/TextField';
import Button from '@/shared/Button';
import { useEffect } from 'react';

type CategoryInputs = {
  name: string;
};

type InputsErrors = Array<{ message: string; name: 'name' }>;

interface CategoryFormProps {
  onCategorySubmit: (data: CategoryInputs) => Promise<InputsErrors | null>;
  category?: {
    _id: string;
    name: string;
  };
}

export const CategoryForm = ({
  onCategorySubmit,
  category,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CategoryInputs>({
    mode: 'onChange',
    resolver: joiResolver(categorySchema),
  });

  useEffect(() => {
    reset({
      name: category?.name ?? '',
    });
  }, [category]);

  const onSubmit = async (data: CategoryInputs) => {
    const submitErrors = await onCategorySubmit(data);

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
        id={category && `name_${category._id}`}
        name="name"
        label="numele categoriei"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>salvează</Button>
      </FormAction>
    </Form>
  );
};
