import { render } from '@/utils/test-utils';
import Footer from '@/shared/Footer';
import { footerBlockLinksList } from '@/utils/links';

describe('Footer', () => {
  it('renders correctly', () => {
    const { container, getByText } = render(<Footer />);

    expect(getByText(footerBlockLinksList[0].text)).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });
});
