import TextField from '@/shared/TextField';
import Button from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/dist/ie11/joi';
import { emailSchema } from '@/utils/validator/schemas/user';
import Form, { FormAction } from '@/shared/Form';
import { UserEmail, UserEmailErrorDetail } from 'types';

type FindUserFormProps = {
  onFindUserSubmit: (
    data: UserEmail,
  ) => Promise<UserEmailErrorDetail[] | undefined>;
};

const FindUserForm = ({ onFindUserSubmit }: FindUserFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserEmail>({
    mode: 'onChange',
    resolver: joiResolver(emailSchema),
  });

  const onSubmit = async (data: UserEmail) => {
    const submitErrors = await onFindUserSubmit(data);

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
};

export default FindUserForm;
