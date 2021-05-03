import { render } from '@/utils/test-utils';
import Label from '@/shared/Label';

describe('Label', () => {
  it('renders correctly', () => {
    const { container, getByText } = render(<Label>heyo</Label>);

    expect(getByText('heyo')).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('error prop', () => {
    it('renders with error style', () => {
      const { container } = render(<Label error>heyo</Label>);

      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--text-danger)',
      );
    });
  });

  describe('success prop', () => {
    it('renders with success style', () => {
      const { container } = render(<Label success>heyo</Label>);

      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--accent-text-dark)',
      );
      expect(container.firstChild).toHaveStyleRule('font-weight', '400');
    });

    it('renders with error style', () => {
      const { container } = render(
        <Label success error>
          heyo
        </Label>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'color',
        'var(--text-danger)',
      );
    });
  });
});
