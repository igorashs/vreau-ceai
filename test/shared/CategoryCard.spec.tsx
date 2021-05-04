import { render } from '@/utils/test-utils';
import CategoryCard from '@/shared/CategoryCard';
import { ImageProps } from 'next/image';

jest.mock('next/image', () => ({ alt, ...all }: ImageProps) => (
  <img {...all} alt={alt} />
));

describe('CategoryCard', () => {
  it('renders correctly', () => {
    const category = {
      name: 'my-category',
      src: 'category.png',
    };

    const { container, getByText, getByRole, getByAltText } = render(
      <CategoryCard category={category} />,
    );

    expect(getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining(category.name),
    );

    const img = getByAltText(category.name);

    expect(img).toHaveAttribute('src', expect.stringContaining(category.src));
    expect(img).toBeVisible();

    expect(getByText(category.name)).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });
});
