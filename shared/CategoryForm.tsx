import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import Form, { FormAction } from '@/shared/Form';
import TextField from '@/shared/TextField';
import Button from '@/shared/Button';
import { useEffect } from 'react';
import { Category, CategoryName, CategoryNameErrorDetail } from 'types';

type CategoryFormProps = {
  onCategorySubmit: (
    data: CategoryName,
  ) => Promise<CategoryNameErrorDetail[] | undefined>;
  category?: Category;
};

const CategoryForm = ({ onCategorySubmit, category }: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CategoryName>({
    mode: 'onChange',
    resolver: joiResolver(categorySchema),
  });

  useEffect(() => {
    reset({
      name: category?.name ?? '',
    });
  }, [category]);

  const onSubmit = async (data: CategoryName) => {
    const submitErrors = await onCategorySubmit(data);

    if (submitErrors) {
      submitErrors.forEach((error) => {
        const { message, name } = error;
        if (name) setError(name, { message });
      });
    } else {
      reset();
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

export default CategoryForm;
