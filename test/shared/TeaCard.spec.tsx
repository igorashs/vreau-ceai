import { render } from '@/utils/test-utils';
import TeaCard from '@/shared/TeaCard';
import { ImageProps } from 'next/image';

jest.mock('next/image', () => ({ alt, ...all }: ImageProps) => (
  <img {...all} alt={alt} />
));

describe('TeaCard', () => {
  it('renders correctly', () => {
    const tea = {
      _id: '1',
      name: 'green-tea',
      src: 'tea.png',
      description: 'tasty tea',
      price: 69,
      quantity: 100,
      total_quantity: 500,
      category_id: '1',
      recommend: false,
    };

    const category = 'green';

    const { container, getByAltText, getByText, getByRole } = render(
      <TeaCard tea={tea} category={category} />,
    );

    expect(getByAltText(tea.name)).toHaveAttribute(
      'src',
      expect.stringContaining(tea.src),
    );

    expect(getByText(tea.name)).toBeVisible();
    expect(getByText(tea.description)).toBeVisible();
    expect(getByText(tea.price, { exact: false })).toBeVisible();
    expect(getByText(tea.quantity, { exact: false })).toBeVisible();
    expect(getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining(`${category}/${tea.name}`),
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
