import { render } from '@/utils/test-utils';
import Textarea from '@/shared/Textarea';

describe('Textarea', () => {
  it('renders correctly', () => {
    const name = 'textarea';
    const label = 'textarea label';

    const { container, getByText, getByRole } = render(
      <Textarea name={name} label={label} />,
    );

    const textarea = getByRole('textbox');

    expect(textarea).toHaveAttribute('name', name);
    expect(textarea).toHaveAttribute('id', name);
    expect(textarea).toHaveAttribute('rows', '2');
    expect(getByText(label)).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('error prop', () => {
    it('renders with error message', () => {
      const name = 'textarea';
      const label = 'textarea label';
      const errorMsg = 'error';

      const { getByText, queryByText } = render(
        <Textarea name={name} label={label} error={errorMsg} />,
      );

      expect(queryByText(label)).not.toBeInTheDocument();
      expect(getByText(errorMsg)).toBeVisible();
    });
  });
});
