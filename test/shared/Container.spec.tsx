import { render } from '@/utils/test-utils';
import Container from '@/shared/Container';

describe('Container', () => {
  it('renders correctly', () => {
    const { container, getByText } = render(<Container>content</Container>);

    expect(container.firstChild).toMatchSnapshot();
    expect(getByText('content')).toBeVisible();
  });
});
