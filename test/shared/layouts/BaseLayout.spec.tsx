import { render, screen } from '@/utils/test-utils';
import withBaseLayout from '@/shared/layouts/BaseLayout';

describe('withBaseLayout', () => {
  it('renders correctly', () => {
    const { container } = render(withBaseLayout(<p>content</p>));

    const content = screen.getByText('content');
    const main = container.querySelector('main');

    expect(content).toBeVisible();
    expect(main).toContainElement(content);
    expect(container).toMatchSnapshot();
  });

  it('renders header elements', () => {
    render(withBaseLayout(<p>content</p>));

    expect(screen.getByRole('link', { name: 'Acasă' })).toBeVisible();
  });

  it('renders footer elements', () => {
    render(withBaseLayout(<p>content</p>));

    expect(
      screen.getByRole('link', { name: 'Visit Project Repo' }),
    ).toBeVisible();
  });
});
