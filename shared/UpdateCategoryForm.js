import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import { Form, FormAction } from '@/shared/Form';
import { TextField } from '@/shared/TextField';
import { Button } from '@/shared/Button';
import { useEffect } from 'react';

export function UpdateCategoryForm({ onUpdateCategorySubmit, category }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(categorySchema),
    defaultValues: {
      name: category.name
    }
  });

  useEffect(() => {
    reset({
      name: category.name
    });
  }, [category]);

  const onSubmit = async (data) => {
    const errors = await onUpdateCategorySubmit(data);

    if (errors) {
      errors.forEach((error) => {
        const { message, name } = error;
        setError(name, { message });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="redenumire"
        error={errors?.name?.message}
        passRef={register}
        type="text"
      />
      <FormAction justify="flex-end">
        <Button>salvează</Button>
      </FormAction>
    </Form>
  );
}
