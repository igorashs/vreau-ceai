import { TextField } from '@/shared/TextField';
import { Button } from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { emailSchema } from '@/utils/validator/schemas/user';
import { Form, FormAction } from '@/shared/Form';

export function FindUserForm({ onFindUserSubmit }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: joiResolver(emailSchema)
  });

  const onSubmit = async (data) => {
    const errors = await onFindUserSubmit(data);

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
        name="email"
        label="user email"
        error={errors?.email?.message}
        passRef={register}
        type="email"
      />
      <FormAction justify="flex-end">
        <Button>caută</Button>
      </FormAction>
    </Form>
  );
}
