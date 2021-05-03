import { render } from '@/utils/test-utils';
import Form, { FormAction } from '@/shared/Form';

describe('Form', () => {
  it('renders correctly', () => {
    const { container, getByText } = render(<Form>content</Form>);

    expect(getByText('content')).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('FormAction', () => {
  it('renders correctly', () => {
    const { container, getByText } = render(<FormAction>content</FormAction>);

    const formAction = getByText('content');

    expect(formAction).toBeVisible();
    expect(formAction).toHaveStyleRule('justify-content', 'stretch');
    expect(formAction).toHaveStyleRule('align-items', 'stretch');
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('justify prop', () => {
    it('renders with space-between', () => {
      const { container } = render(
        <FormAction justify="space-between">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'justify-content',
        'space-between',
      );
    });

    it('renders with flex-end', () => {
      const { container } = render(
        <FormAction justify="flex-end">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'justify-content',
        'flex-end',
      );
    });

    it('renders with flex-start', () => {
      const { container } = render(
        <FormAction justify="flex-start">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule(
        'justify-content',
        'flex-start',
      );
    });

    it('renders with center', () => {
      const { container } = render(
        <FormAction justify="center">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule('justify-content', 'center');
    });
  });

  describe('align prop', () => {
    it('renders with flex-end', () => {
      const { container } = render(
        <FormAction align="flex-end">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule('align-items', 'flex-end');
    });

    it('renders with flex-start', () => {
      const { container } = render(
        <FormAction align="flex-start">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule('align-items', 'flex-start');
    });

    it('renders with center', () => {
      const { container } = render(
        <FormAction align="center">content</FormAction>,
      );

      expect(container.firstChild).toHaveStyleRule('align-items', 'center');
    });
  });
});
