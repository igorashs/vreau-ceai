import { render, fireEvent } from '@/utils/test-utils';
import DropDownList from '@/shared/DropDownList';

describe('DropDownList', () => {
  it('should render correctly', () => {
    const label = 'my list';

    const { container, getByText } = render(
      <DropDownList label={label}>
        <li>item1</li>
        <li>item2</li>
      </DropDownList>,
    );

    expect(getByText(label)).toBeVisible();
    expect(getByText('item1')).toBeVisible();
    expect(getByText('item2')).toBeVisible();
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('.onButtonClick', () => {
    it('toggles list', () => {
      const label = 'my list';

      const { getByText, getByRole } = render(
        <DropDownList label={label}>
          <li>item1</li>
          <li>item2</li>
        </DropDownList>,
      );

      fireEvent.click(getByRole('button'));
      const listItem = getByText('item1');

      expect(listItem).not.toBeVisible();
      expect(listItem.parentElement).not.toBeVisible();
      expect(listItem.parentElement).toHaveStyleRule('display', 'none');
      expect(getByRole('button').parentElement).toHaveStyleRule(
        'transform',
        'rotate(90deg)',
        {
          modifier: 'button',
        },
      );

      fireEvent.click(getByRole('button'));
      expect(listItem).toBeVisible();
    });
  });
});
