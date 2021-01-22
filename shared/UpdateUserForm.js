import styled from 'styled-components';
import { Button } from '@/shared/Button';
import { useForm } from 'react-hook-form';
import { Form, FormAction } from '@/shared/Form';
import { CheckBox } from '@/shared/CheckBox';
import { useEffect } from 'react';
import { Label } from '@/shared/Label';

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 7px 0;
  border-bottom: 1px solid var(--layout);
`;

export function UpdateUserForm({ onUpdateUserSubmit, user }) {
  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      isManager: user.isManager
    }
  });

  useEffect(() => {
    reset({
      isManager: user.isManager
    });
  }, [user]);

  return (
    <Form onSubmit={handleSubmit(onUpdateUserSubmit)}>
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
}
