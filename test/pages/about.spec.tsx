import { render } from '@/utils/test-utils';
import About from 'pages/about';

describe('About page', () => {
  it('should render properly', () => {
    const { getByText } = render(<About />, {});

    expect(getByText('Despre noi')).toBeInTheDocument();
  });
});
