import { render } from '@/utils/test-utils';
import InputFile from '@/shared/InputFile';

describe('InputFile', () => {
  it('renders correctly', () => {
    const name = 'file';
    const label = 'file label';

    const { container, getByText, getByLabelText } = render(
      <InputFile name={name} label={label}>
        content
      </InputFile>,
    );

    const input = getByLabelText('content');

    expect(input).toHaveAttribute('name', name);
    expect(input).toHaveAttribute('id', name);
    expect(input).toHaveAttribute('type', 'file');
    expect(getByText('content')).toBeVisible();
    expect(getByText(label)).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('error prop', () => {
    it('renders with error message', () => {
      const name = 'file';
      const label = 'file label';
      const errorMsg = 'error';

      const { queryByText, getByText } = render(
        <InputFile name={name} label={label} error={errorMsg}>
          content
        </InputFile>,
      );

      expect(queryByText(label)).not.toBeInTheDocument();
      expect(getByText(errorMsg)).toBeVisible();
    });
  });

  describe('fullWidth prop', () => {
    it('renders with fulWidth', () => {
      const name = 'file';
      const label = 'file label';

      const { getByLabelText } = render(
        <InputFile name={name} label={label} fullWidth>
          content
        </InputFile>,
      );

      expect(getByLabelText('content').parentElement).toHaveStyleRule(
        'width',
        '100%',
      );
    });
  });
});
