import { render } from '@/utils/test-utils';
import Leaves from '@/shared/Leaves';

describe('Leaves', () => {
  it('renders correctly', () => {
    const { container } = render(<Leaves />);

    const svgIcon = container.querySelector('svg');

    expect(container.firstChild).toMatchSnapshot();
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute('height', '112');
    expect(svgIcon).toHaveAttribute('width', '112');
  });
});
