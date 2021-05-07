import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';
import FindCategoryForm from '@/shared/FindCategoryForm';
import { categoryMessages } from '@/utils/validator/schemas/category';
import { CategoryNameErrorDetail } from 'types';

const onFindCategorySubmitMock = jest.fn(
  (): Promise<CategoryNameErrorDetail[] | undefined> =>
    Promise.resolve(undefined),
);

describe('FindCategoryForm', () => {
  it('renders correctly', () => {
    const { container, getByRole } = render(
      <FindCategoryForm onFindCategorySubmit={onFindCategorySubmitMock} />,
    );

    expect(getByRole('textbox')).toHaveValue('');
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('name validation', () => {
    beforeEach(() =>
      render(
        <FindCategoryForm onFindCategorySubmit={onFindCategorySubmitMock} />,
      ),
    );

    it('should display required error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(categoryMessages.required)).toBeVisible(),
      );
      expect(onFindCategorySubmitMock).not.toBeCalled();
    });

    it('should display max length error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.change(getByRole('textbox'), {
        target: { value: 'qwertyuiopasdfghjklzxcvbnmqwert' },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(categoryMessages.max)).toBeVisible(),
      );
      expect(onFindCategorySubmitMock).not.toBeCalled();
    });
  });

  describe('success submission', () => {
    it('should reset the form', async () => {
      const { getByRole, getByText } = render(
        <FindCategoryForm onFindCategorySubmit={onFindCategorySubmitMock} />,
      );

      const name = 'green';

      fireEvent.submit(getByRole('button'));
      fireEvent.change(getByRole('textbox'), { target: { value: name } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindCategorySubmitMock).toBeCalledTimes(1));
      expect(onFindCategorySubmitMock).toBeCalledWith({ name });
      expect(getByRole('textbox')).toHaveValue(name);
      expect(getByText('numele categoriei')).toBeVisible();
    });
  });

  describe('server validation', () => {
    it('should display max length error', async () => {
      // pretend user bypass client validation
      onFindCategorySubmitMock.mockResolvedValueOnce([
        { message: categoryMessages.max, name: 'name' },
      ]);

      const { getByRole, getByText } = render(
        <FindCategoryForm onFindCategorySubmit={onFindCategorySubmitMock} />,
      );

      fireEvent.change(getByRole('textbox'), { target: { value: 'green' } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindCategorySubmitMock).toBeCalledTimes(1));
      expect(onFindCategorySubmitMock).toBeCalledWith({ name: 'green' });
      expect(getByText(categoryMessages.max)).toBeVisible();
    });
  });
});
