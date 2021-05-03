import StyledLink from '@/shared/StyledLink';
import { render } from '@/utils/test-utils';

describe('StyledLink', () => {
  it('renders correctly', () => {
    const { container, getByRole, getByText } = render(
      <StyledLink href="/home" label="go home">
        home
      </StyledLink>,
    );

    expect(getByRole('link')).toBeInTheDocument();
    expect(getByText('home')).toBeVisible();
    expect(container.firstChild).toHaveAttribute('aria-label', 'go home');
    expect(container.firstChild).toHaveAttribute('href', '/home');
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('button prop', () => {
    it('renders with button styles', () => {
      const { getByRole, getByText, queryByText } = render(
        <StyledLink href="/home" label="go home" button text="home">
          children
        </StyledLink>,
      );

      expect(getByRole('link')).toBeInTheDocument();
      expect(getByText('home')).toBeVisible();
      expect(queryByText('children')).not.toBeInTheDocument();
    });
  });

  describe('accent prop', () => {
    it('renders with light accent', () => {
      const { container } = render(
        <StyledLink href="/home" label="go home" accent="light">
          home
        </StyledLink>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--accent-text-light)',
      );
    });

    it('renders with dark accent', () => {
      const { container } = render(
        <StyledLink href="/home" label="go home" accent="dark">
          home
        </StyledLink>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--accent-text-dark)',
      );
    });
  });

  describe('underline prop', () => {
    it('renders with underline rule', () => {
      const { container } = render(
        <StyledLink href="/home" label="go home" underline>
          home
        </StyledLink>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'text-decoration',
        'underline',
      );
    });
  });
});
