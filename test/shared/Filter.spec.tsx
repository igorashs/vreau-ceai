import { render, fireEvent } from '@/utils/test-utils';
import Filter from '@/shared/Filter';

describe('Filter', () => {
  it('renders correctly', () => {
    const onSearchMock = jest.fn();

    const { container, getByText } = render(
      <Filter text="filterOne" onChange={onSearchMock} />,
    );

    const btn = container.querySelector('button');

    expect(btn).toBeInTheDocument();
    if (btn) expect(fireEvent.click(btn));
    expect(onSearchMock).toBeCalledTimes(1);
    expect(getByText('filterOne')).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('checked prop', () => {
    it('renders with CheckSvg', () => {
      const onSearchMock = jest.fn();

      const { container } = render(
        <Filter text="filterOne" onChange={onSearchMock} checked />,
      );

      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });
  });
});
