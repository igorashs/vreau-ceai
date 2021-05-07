import { fireEvent, render, waitFor } from '@/utils/test-utils';
import UserForm from '@/shared/UserForm';
import { User } from 'types';

const onUserSubmitMock = jest.fn();

describe('UserForm', () => {
  it('renders correctly', () => {
    const user: User = {
      _id: '1',
      email: 'user@user.com',
      isManager: true,
      name: 'user',
    };

    const { container, getByText, getByRole } = render(
      <UserForm onUserSubmit={onUserSubmitMock} user={user} />,
    );

    expect(getByText(user.email)).toBeVisible();
    expect(getByText(user.name)).toBeVisible();
    expect(getByRole('checkbox')).toBeChecked();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('success submission', () => {
    it('calls with expected values', async () => {
      const user: User = {
        _id: '1',
        email: 'user@user.com',
        isManager: true,
        name: 'user',
      };

      const { getByRole } = render(
        <UserForm onUserSubmit={onUserSubmitMock} user={user} />,
      );

      fireEvent.click(getByRole('checkbox'));
      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(onUserSubmitMock).toBeCalledWith({ isManager: false }),
      );

      expect(getByRole('checkbox')).not.toBeChecked();
    });
  });

  // ? currently doesn't have any validation error
});
