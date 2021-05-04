import { render, fireEvent } from '@/utils/test-utils';
import DropDown from '@/shared/DropDown';

describe('DropDown', () => {
  it('renders correctly', () => {
    const title = 'DropDown title';

    const { container, getByText, getByRole } = render(
      <DropDown title={title}>content</DropDown>,
    );

    expect(getByText(title)).toBeVisible();
    expect(getByText('content')).not.toBeVisible();
    expect(getByText('content')).toHaveStyleRule('display', 'none');
    expect(getByRole('button').parentElement).toHaveStyleRule(
      'transform',
      'rotate(90deg)',
      {
        modifier: 'button:last-child',
      },
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('.onToggleHideClick', () => {
    it('toggles content', () => {
      const title = 'DropDown title';

      const { getByText, getByRole } = render(
        <DropDown title={title}>content</DropDown>,
      );

      const toggleBtn = getByRole('button');
      fireEvent.click(toggleBtn);

      expect(getByText('content')).toBeVisible();
      expect(toggleBtn.parentElement).toHaveStyleRule(
        'transform',
        'rotate(-90deg)',
        {
          modifier: 'button:last-child',
        },
      );

      fireEvent.click(toggleBtn);
      expect(getByText('content')).not.toBeVisible();
    });
  });

  describe('.onDeleteClick', () => {
    it('renders delete btn', () => {
      const title = 'DropDown title';
      const onDeleteClickMock = jest.fn();

      const { getAllByRole } = render(
        <DropDown title={title} onDeleteClick={onDeleteClickMock}>
          content
        </DropDown>,
      );

      const buttons = getAllByRole('button');

      expect(buttons.length).toBe(2);
      fireEvent.click(buttons[0]);

      expect(onDeleteClickMock).toBeCalledTimes(1);
    });
  });

  describe('label prop', () => {
    it('renders with label', () => {
      const title = 'DropDown title';
      const label = 'DropDown label';

      const { getByText } = render(
        <DropDown title={title} label={label}>
          content
        </DropDown>,
      );

      expect(getByText(label)).toBeVisible();
    });
  });

  describe('CustomHeading prop', () => {
    it('renders with a custom heading', () => {
      const title = 'DropDown title';
      const CustomHeading = () => <h5>custom heading</h5>;

      const { getByText, queryByText } = render(
        <DropDown title={title} CustomHeading={CustomHeading}>
          content
        </DropDown>,
      );

      expect(queryByText(title)).not.toBeInTheDocument();
      expect(getByText('custom heading')).toBeVisible();
    });
  });
});
