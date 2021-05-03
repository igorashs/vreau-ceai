import { render } from '@/utils/test-utils';
import Select from '@/shared/Select';

describe('Select', () => {
  it('renders correctly', () => {
    const name = 'select';
    const label = 'select label';

    const { container, getByRole, getByText } = render(
      <Select name={name} label={label}>
        <option value="op1">op1</option>
        <option value="op2">op2</option>
      </Select>,
    );

    const select = getByRole('combobox');

    expect(select).toHaveAttribute('name', name);
    expect(select).toHaveAttribute('id', name);
    expect(getByText(label)).toBeVisible();
    expect(getByText('op1')).toBeVisible();
    expect(getByText('op2')).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('fullWidth prop', () => {
    it('renders with fullWidth', () => {
      const name = 'select';
      const label = 'select label';

      const { getByRole } = render(
        <Select name={name} label={label} fullWidth>
          <option value="op1">op1</option>
          <option value="op2">op2</option>
        </Select>,
      );

      expect(getByRole('combobox').parentElement).toHaveStyleRule(
        'width',
        '100%',
      );
    });
  });
});
