import { render, screen } from '@/utils/test-utils';
import withLayout from '@/shared/layouts/Layout';

describe('withLayout', () => {
  it('renders correctly', () => {
    const { container } = render(withLayout(<p>content</p>));

    expect(screen.getByText('content')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('renders header elements', () => {
    render(withLayout(<p>content</p>));

    expect(screen.getByRole('link', { name: 'Acasă' })).toBeVisible();
  });

  it('renders footer elements', () => {
    render(withLayout(<p>content</p>));

    expect(
      screen.getByRole('link', { name: 'Visit Project Repo' }),
    ).toBeVisible();
  });
});
