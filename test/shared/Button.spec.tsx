import { render } from '@/utils/test-utils';
import Button from '@/shared/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { container, getByRole, getByText } = render(
      <Button>click me</Button>,
    );

    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('click me')).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('btnStyle prop', () => {
    it('renders with danger style', () => {
      const { container } = render(<Button btnStyle="danger">click me</Button>);

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        'var(--danger-dark)',
      );
      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        'var(--danger)',
        {
          modifier: ':hover',
        },
      );
    });

    it('renders with none style', () => {
      const { container } = render(<Button btnStyle="none">click me</Button>);

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        'transparent',
      );
      expect(container.firstChild).toHaveStyleRule('box-shadow', 'none');
      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        '#0000001a',
        { modifier: ':hover' },
      );
    });

    it('renders with danger-text style', () => {
      const { container } = render(
        <Button btnStyle="danger-text">click me</Button>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        'transparent',
      );
      expect(container.firstChild).toHaveStyleRule('text-transform', 'initial');
      expect(container.firstChild).toHaveStyleRule('box-shadow', 'none');
      expect(container.firstChild).toHaveStyleRule(
        'background-color',
        'transparent',
        { modifier: ':hover' },
      );
      expect(container.firstChild).toHaveStyleRule(
        'filter',
        'brightness(0.7)',
        { modifier: ':hover' },
      );
      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--text-danger-light)',
      );
    });

    it('renders with accent text style', () => {
      const { container } = render(
        <Button btnStyle="accent-text">click me</Button>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--accent-text-dark)',
      );
    });

    it('renders with dark text style', () => {
      const { container } = render(
        <Button btnStyle="dark-text">click me</Button>,
      );

      expect(container.firstChild).toHaveStyleRule('color', 'var(--text-dark)');
    });
  });

  describe('icon prop', () => {
    it('renders correctly', () => {
      const { container } = render(<Button icon>Click me</Button>);

      expect(container.firstChild).toHaveStyleRule('padding', '4px');
      expect(container.firstChild).toHaveStyleRule('box-shadow', 'none');
    });
  });

  describe('noPadding prop', () => {
    it('renders correctly', () => {
      const { container } = render(<Button noPadding>Click me</Button>);

      expect(container.firstChild).toHaveStyleRule('padding', '0');
    });
  });
});
