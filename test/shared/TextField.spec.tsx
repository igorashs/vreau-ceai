import { render } from '@/utils/test-utils';
import TextField from '@/shared/TextField';

describe('TextField', () => {
  it('renders correctly', () => {
    const name = 'field';
    const label = 'field label';

    const { container, getByText, getByPlaceholderText } = render(
      <TextField name={name} label={label} placeholder="text field" />,
    );

    const input = getByPlaceholderText('text field');

    expect(input).toHaveAttribute('name', name);
    expect(input).toHaveAttribute('id', name);
    expect(getByText(label)).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('error prop', () => {
    it('it renders with error message', () => {
      const name = 'field';
      const label = 'field label';
      const errorMsg = 'error';

      const { getByText, queryByText } = render(
        <TextField
          name={name}
          label={label}
          error={errorMsg}
          placeholder="text field"
        />,
      );

      expect(queryByText(label)).not.toBeInTheDocument();
      expect(getByText(errorMsg)).toBeVisible();
    });
  });
});
