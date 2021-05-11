import { render, screen, waitFor, renderWithSession } from '@/utils/test-utils';
import {
  createStoreLayout,
  withCategoryStoreLayout,
  withManagementStoreLayout,
} from '@/shared/layouts/StoreLayout';
import { getCategories } from 'services/ceaiApi';

describe('createStoreLayout', () => {
  it('renders correctly', () => {
    const withStoreLayout = createStoreLayout(() => <p>menu</p>);
    const { container } = render(withStoreLayout(<p>content</p>));

    expect(screen.getByText('menu')).toBeVisible();
    expect(screen.getByText('content')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('renders header elements', () => {
    const withStoreLayout = createStoreLayout(() => <p>menu</p>);
    render(withStoreLayout(<p>content</p>));

    expect(screen.getByRole('link', { name: 'Acasă' })).toBeVisible();
  });

  it('renders footer elements', () => {
    const withStoreLayout = createStoreLayout(() => <p>menu</p>);
    render(withStoreLayout(<p>content</p>));

    expect(
      screen.getByRole('link', { name: 'Visit Project Repo' }),
    ).toBeVisible();
  });
});

const categories = [
  {
    _id: '1',
    name: 'green',
  },
  {
    _id: '2',
    name: 'fruit',
  },
];

jest.mock('services/ceaiApi', () => ({
  getCategories: jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({ success: true, message: 'Success', categories }),
    ),
}));

describe('withCategoryStoreLayout', () => {
  it('renders with category menu', async () => {
    render(withCategoryStoreLayout(<p>content</p>));

    await waitFor(() => expect(getCategories).toBeCalledTimes(1));

    screen
      .getAllByRole('link', {
        name: `Categoria ${categories[0].name}`,
      })
      .forEach((link) => expect(link).toBeVisible());

    expect(screen.getByText('content')).toBeVisible();
  });
});

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

describe('withManagementStoreLayout', () => {
  it('renders with management menu', () => {
    renderWithSession(withManagementStoreLayout(<p>content</p>), session);

    expect(screen.getByText('Users management')).toBeVisible();
    expect(screen.getByText('Shop management')).toBeVisible();
    expect(screen.getByText('content')).toBeVisible();
  });
});
