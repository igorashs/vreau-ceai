import { render, waitFor } from '@/utils/test-utils';
import CategoryMenu from '@/shared/CategoryMenu';
import { getCategories } from 'services/ceaiApi';

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
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ success: false, message: 'Not Found' }),
    ),
}));

describe('CategoryMenu', () => {
  beforeEach((getCategories as jest.Mock).mockClear);

  it('renders correctly', async () => {
    const { container, getAllByRole } = render(<CategoryMenu />);

    await waitFor(() => expect(getCategories).toBeCalledTimes(1));

    const categoriesList = getAllByRole('link');

    categoriesList.forEach((category, i) => {
      expect(category).toBeVisible();
      expect(category).toHaveTextContent(categories[i].name);
      expect(category).toHaveAttribute(
        'href',
        expect.stringContaining(categories[i].name),
      );
      expect(category).toHaveAttribute(
        'aria-label',
        expect.stringContaining(categories[i].name),
      );
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it("doesn't render the list with no data", () => {
    const { queryAllByRole } = render(<CategoryMenu />);

    expect(queryAllByRole('link').length).toBe(0);
    expect(getCategories).toBeCalledTimes(1);
  });
});
