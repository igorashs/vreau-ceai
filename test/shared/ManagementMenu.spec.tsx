import { render } from '@/utils/test-utils';
import ManagementMenu from '@/shared/ManagementMenu';
import { SessionProvider } from 'contexts/SessionContext';
import { managementLinks } from '@/utils/links';

const { users, orders, products, categories } = managementLinks;

const session = {
  isAuth: true,
  user: {
    _id: 'user1',
    name: 'kekw',
    isAdmin: true,
    isManager: true,
  },
  needRefresh: false,
};

describe('ManagementMenu', () => {
  it('renders correctly', () => {
    const { container, getByText, getAllByRole } = render(
      <SessionProvider session={session}>
        <ManagementMenu />
      </SessionProvider>,
    );

    expect(getByText('Users management')).toBeVisible();
    expect(getByText('Shop management')).toBeVisible();
    expect(getByText(users[0].text)).toBeVisible();
    expect(getByText(orders[0].text)).toBeVisible();
    expect(getByText(products[0].text)).toBeVisible();
    expect(getByText(categories[0].text)).toBeVisible();
    expect(getAllByRole('listitem').length).toBe(
      Object.values(managementLinks).reduce(
        (count, links) => links.length + count,
        0,
      ),
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  describe('when isAdmin is false', () => {
    it("doesn't render the admin links", () => {
      const { queryByText } = render(
        <SessionProvider
          session={{ ...session, user: { ...session.user, isAdmin: false } }}
        >
          <ManagementMenu />
        </SessionProvider>,
      );

      expect(queryByText('Users management')).not.toBeInTheDocument();
      expect(queryByText(users[0].text)).not.toBeInTheDocument();
    });
  });

  describe('when isManager is false', () => {
    it("doesn't render the manager links", () => {
      const { queryByText } = render(
        <SessionProvider
          session={{ ...session, user: { ...session.user, isManager: false } }}
        >
          <ManagementMenu />
        </SessionProvider>,
      );

      expect(queryByText('Shop management')).not.toBeInTheDocument();
      expect(queryByText(orders[0].text)).not.toBeInTheDocument();
      expect(queryByText(products[0].text)).not.toBeInTheDocument();
      expect(queryByText(categories[0].text)).not.toBeInTheDocument();
    });
  });
});
