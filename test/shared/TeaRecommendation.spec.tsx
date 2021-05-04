import { render } from '@/utils/test-utils';
import TeaRecommendation from '@/shared/TeaRecommendation';
import { ProductWithCategory } from 'types';
import { ImageProps } from 'next/image';

jest.mock('next/image', () => ({ alt, ...all }: ImageProps) => (
  <img {...all} alt={alt} />
));

describe('TeaRecommendation', () => {
  it('renders correctly', () => {
    const tea = {
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
    } as ProductWithCategory;

    const { container, getByAltText, getByText, getByRole } = render(
      <TeaRecommendation tea={tea} />,
    );

    expect(getByAltText(tea.name)).toHaveAttribute(
      'src',
      expect.stringContaining(tea.src),
    );

    expect(getByText(tea.name)).toBeVisible();
    expect(getByText(tea.description)).toBeVisible();
    expect(getByText(`${tea.price}lei`, { exact: false })).toBeVisible();
    expect(getByText(`${tea.quantity}g`, { exact: false })).toBeVisible();

    expect(getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining(`${tea.category_id.name}/${tea.name}`),
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
