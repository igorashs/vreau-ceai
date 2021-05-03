import { render } from '@/utils/test-utils';
import CheckBox from '@/shared/CheckBox';

describe('CheckBox', () => {
  it('renders correctly', () => {
    const name = 'checkbox';
    const label = 'checkbox label';

    const { container, getByText, getByRole } = render(
      <CheckBox name={name} label={label} />,
    );

    const checkbox = getByRole('checkbox');

    expect(checkbox).toHaveAttribute('name', name);
    expect(checkbox).toHaveAttribute('id', name);
    expect(getByText(label)).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('error prop', () => {
    it('renders with error message', () => {
      const name = 'checkbox';
      const label = 'checkbox label';
      const errorMsg = 'error';

      const { getByText, queryByText } = render(
        <CheckBox name={name} label={label} error={errorMsg} />,
      );

      expect(queryByText(label)).not.toBeInTheDocument();
      expect(getByText(errorMsg)).toBeVisible();
    });
  });
});
