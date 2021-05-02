import TextField from '@/shared/TextField';
import Button from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { categorySchema } from '@/utils/validator/schemas/category';
import Form, { FormAction } from '@/shared/Form';
import { CategoryName, CategoryNameErrorDetail } from 'types';

type FindCategoryFormProps = {
  onFindCategorySubmit: (
    data: CategoryName,
  ) => Promise<CategoryNameErrorDetail[] | undefined>;
};

const FindCategoryForm = ({ onFindCategorySubmit }: FindCategoryFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryName>({
    mode: 'onChange',
    resolver: joiResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryName) => {
    const submitErrors = await onFindCategorySubmit(data);

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
};

export default FindCategoryForm;
