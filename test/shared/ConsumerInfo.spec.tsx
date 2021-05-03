import { render } from '@/utils/test-utils';
import ConsumerInfo from '@/shared/ConsumerInfo';

describe('ConsumerInfo', () => {
  it('renders correctly', () => {
    const consumer = {
      name: 'qwerty',
      email: '1@1.com',
      tel: '061111111',
      address: 'add1',
    };

    const { container, getByText } = render(<ConsumerInfo {...consumer} />);

    expect(getByText(consumer.name)).toBeVisible();
    expect(getByText(consumer.email)).toBeVisible();
    expect(getByText(consumer.tel)).toBeVisible();
    expect(getByText(consumer.address)).toBeVisible();

    expect(container.firstChild).toMatchSnapshot();
  });
});
