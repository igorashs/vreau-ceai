import { render } from '@/utils/test-utils';
import Footer from '@/shared/Footer';

describe('Footer', () => {
  it('renders correctly', () => {
    const { container } = render(<Footer />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
