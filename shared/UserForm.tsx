import styled from 'styled-components';
import Button from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { Form, FormAction } from '@/shared/Form';
import CheckBox from '@/shared/CheckBox';
import { useEffect } from 'react';
import { Label } from '@/shared/Label';

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 7px 0;
  border-bottom: 1px solid var(--layout);
`;

type UserInputs = {
  isManager: boolean;
};

interface UserFormProps {
  onUserSubmit: (data: UserInputs) => void;
  user: {
    isManager: boolean;
    name: string;
    email: string;
  };
}

export const UserForm = ({ onUserSubmit, user }: UserFormProps) => {
  const { register, handleSubmit, reset } = useForm<UserInputs>({
    mode: 'onChange',
    defaultValues: {
      isManager: user.isManager,
    },
  });

  useEffect(() => {
    reset({
      isManager: user.isManager,
    });
  }, [user]);

  return (
    <Form onSubmit={handleSubmit(onUserSubmit)}>
      <div>
        <UserData>
          <Label>name</Label>
          {user.name}
        </UserData>
        <UserData>
          <Label>email</Label>
          {user.email}
        </UserData>
        <UserData>
          <Label>permisiuni</Label>
          <CheckBox label="manager" passRef={register} name="isManager" />
        </UserData>
      </div>
      <FormAction justify="flex-end">
        <Button>salvează</Button>
      </FormAction>
    </Form>
  );
};
