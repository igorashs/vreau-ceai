import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';
import FindUserForm from '@/shared/FindUserForm';
import { UserEmailErrorDetail } from 'types';
import { userMessages } from '@/utils/validator/schemas/user';

const onFindUserSubmitMock = jest.fn(
  (): Promise<UserEmailErrorDetail[] | undefined> => Promise.resolve(undefined),
);

describe('FindUserForm', () => {
  it('renders correctly', () => {
    const { container, getByRole } = render(
      <FindUserForm onFindUserSubmit={onFindUserSubmitMock} />,
    );

    expect(getByRole('textbox')).toHaveValue('');
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('email validation', () => {
    beforeEach(() =>
      render(<FindUserForm onFindUserSubmit={onFindUserSubmitMock} />),
    );

    it('should display required error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(userMessages.email.required)).toBeVisible(),
      );

      expect(onFindUserSubmitMock).not.toBeCalled();
    });

    it('should display invalid error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.change(getByRole('textbox'), {
        target: { value: 'notvalid.com' },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(userMessages.email.invalid)).toBeVisible(),
      );

      expect(onFindUserSubmitMock).not.toBeCalled();
    });

    it('should display max length error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.change(getByRole('textbox'), {
        target: {
          value:
            'morethan16@16charactersssssssssssssssssssssssssssssssssss.com',
        },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(userMessages.email.max)).toBeVisible(),
      );

      expect(onFindUserSubmitMock).not.toBeCalled();
    });
  });

  describe('success submission', () => {
    it('should reset the form', async () => {
      const { getByRole, getByText } = render(
        <FindUserForm onFindUserSubmit={onFindUserSubmitMock} />,
      );

      const email = 'user@user.com';

      fireEvent.submit(getByRole('button'));
      fireEvent.change(getByRole('textbox'), { target: { value: email } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindUserSubmitMock).toBeCalledTimes(1));
      expect(onFindUserSubmitMock).toBeCalledWith({ email });
      expect(getByRole('textbox')).toHaveValue(email);
      expect(getByText('user email')).toBeVisible();
    });
  });

  describe('server validation', () => {
    it('should display required error', async () => {
      // pretend user bypass client validation
      onFindUserSubmitMock.mockResolvedValueOnce([
        { message: userMessages.email.required, name: 'email' },
      ]);

      const { getByRole, getByText } = render(
        <FindUserForm onFindUserSubmit={onFindUserSubmitMock} />,
      );

      fireEvent.change(getByRole('textbox'), {
        target: { value: 'user@user.com' },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindUserSubmitMock).toBeCalledTimes(1));
      expect(onFindUserSubmitMock).toBeCalledWith({ email: 'user@user.com' });
      expect(getByText(userMessages.email.required)).toBeVisible();
    });
  });
});
