import { fireEvent, renderWithSession, waitFor } from '@/utils/test-utils';
import Header from '@/shared/Header';
import { logout } from 'services/ceaiApi';
import { useRouter } from 'next/router';
import { loginLink, managementLink, myOrdersLink } from '@/utils/links';

const user = {
  _id: 'user1',
  name: 'username',
  isAdmin: false,
  isManager: false,
};

const session = {
  isAuth: false,
  user: null,
  needRefresh: false,
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('services/ceaiApi', () => ({
  logout: jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({ success: true, message: 'Success' }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ success: false, message: 'Bad Request' }),
    ),
}));

describe('Header', () => {
  beforeEach((logout as jest.Mock).mockClear);

  it('renders correctly', () => {
    const {
      container,
      getByText,
      queryByText,
      getByTestId,
      queryByTestId,
    } = renderWithSession(<Header />, session);

    expect(getByText(loginLink.text)).not.toBeVisible();
    expect(queryByText(managementLink.text)).not.toBeInTheDocument();
    expect(queryByTestId('logout-btn')).not.toBeInTheDocument();
    expect(getByTestId('toggle-btn').parentElement).toHaveStyleRule(
      'display',
      'none',
      {
        media: '(min-width:992px)',
      },
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  describe('.onNavToggleClick', () => {
    it('toggles nav list', () => {
      const { getByTestId, getByText } = renderWithSession(<Header />, session);

      const toggleBtn = getByTestId('toggle-btn');
      fireEvent.click(toggleBtn);

      expect(getByText(loginLink.text)).toBeVisible();
      fireEvent.click(toggleBtn);
      expect(getByText(loginLink.text)).not.toBeVisible();
    });
  });

  describe('when user is authenticated', () => {
    describe('when user is updated', () => {
      it('renders with the correct links', () => {
        const {
          getByText,
          queryByText,
          rerenderWithSession,
        } = renderWithSession(<Header />, {
          ...session,
          isAuth: true,
          user,
        });

        expect(queryByText(managementLink.text)).not.toBeInTheDocument();
        expect(getByText(myOrdersLink.text)).toBeInTheDocument();
        expect(getByText(user.name)).toBeInTheDocument();

        rerenderWithSession(<Header />, {
          ...session,
          isAuth: true,
          user: { ...user, isManager: true },
        });

        expect(getByText(managementLink.text)).toBeInTheDocument();
      });
    });

    describe('.onLogoutClick', () => {
      it('reloads with success', async () => {
        const mockRouter = {
          reload: jest.fn(),
        };

        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        const { getByTestId } = renderWithSession(<Header />, {
          ...session,
          isAuth: true,
          user,
        });

        fireEvent.click(getByTestId('logout-btn'));

        await waitFor(() => expect(logout).toBeCalledTimes(1));
        expect(mockRouter.reload).toBeCalledTimes(1);
      });

      it("doesn't reload", async () => {
        const mockRouter = {
          reload: jest.fn(),
        };

        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        const { getByTestId } = renderWithSession(<Header />, {
          ...session,
          isAuth: true,
          user,
        });

        fireEvent.click(getByTestId('logout-btn'));

        expect(logout).toBeCalledTimes(1);
        expect(mockRouter.reload).toBeCalledTimes(0);
      });
    });

    describe('when user is a client', () => {
      it('renders user data with private links', () => {
        const { getByText, queryByText } = renderWithSession(<Header />, {
          ...session,
          isAuth: true,
          user,
        });

        expect(queryByText(loginLink.text)).not.toBeInTheDocument();
        expect(getByText(myOrdersLink.text)).toBeInTheDocument();
        expect(getByText(user.name)).toBeInTheDocument();
      });
    });

    describe('when user is a manager/admin', () => {
      it('renders management link', () => {
        const { getByText, rerenderWithSession } = renderWithSession(
          <Header />,
          {
            ...session,
            isAuth: true,
            user: { ...user, isManager: true },
          },
        );

        expect(getByText(managementLink.text)).toBeInTheDocument();

        rerenderWithSession(<Header />, {
          ...session,
          isAuth: true,
          user: { ...user, isAdmin: true },
        });

        expect(getByText(managementLink.text)).toBeInTheDocument();
      });
    });
  });
});
