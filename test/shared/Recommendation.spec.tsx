import { render, waitFor } from '@/utils/test-utils';
import Recommendation from '@/shared/Recommendation';
import { getRecommendedProducts } from 'services/ceaiApi';

const products = [
  {
    _id: '1',
    name: 'green-tea',
    description: 'tasty tea',
    recommend: true,
    src: 'tea.png',
    price: 39,
    quantity: 50,
    total_quantity: 500,
    category_id: {
      name: 'green',
    },
  },
];

jest.mock('services/ceaiApi', () => ({
  getRecommendedProducts: jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        success: true,
        message: 'Success',
        products,
      }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        success: false,
        message: 'Not Found',
      }),
    ),
}));

describe('Recommendation', () => {
  beforeEach((getRecommendedProducts as jest.Mock).mockClear);

  it('renders correctly', async () => {
    const { container, getAllByRole } = render(<Recommendation />);

    await waitFor(() => expect(getRecommendedProducts).toBeCalledTimes(1));
    expect(getRecommendedProducts).toBeCalledWith(3);

    const listItems = getAllByRole('listitem');

    expect(listItems[0]).toHaveTextContent(products[0].name);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("doesn't render with no data", () => {
    const { container } = render(<Recommendation />);

    expect(getRecommendedProducts).toBeCalledTimes(1);
    expect(getRecommendedProducts).toBeCalledWith(3);
    expect(container).toBeEmptyDOMElement();
  });
});
