import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';
import CategoryForm from '@/shared/CategoryForm';
import { categoryMessages } from '@/utils/validator/schemas/category';
import { CategoryNameErrorDetail } from 'types';

const onCategorySubmitMock = jest.fn(
  (): Promise<CategoryNameErrorDetail[] | undefined> =>
    Promise.resolve(undefined),
);

describe('CategoryForm', () => {
  it('renders correctly', () => {
    const { container, getByRole } = render(
      <CategoryForm onCategorySubmit={onCategorySubmitMock} />,
    );

    expect(getByRole('textbox')).toHaveValue('');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with initial value', () => {
    const category = { _id: '1', name: 'green' };

    const { getByRole } = render(
      <CategoryForm
        onCategorySubmit={onCategorySubmitMock}
        category={category}
      />,
    );

    expect(getByRole('textbox')).toHaveValue(category.name);
  });

  describe('name validation', () => {
    beforeEach(() =>
      render(<CategoryForm onCategorySubmit={onCategorySubmitMock} />),
    );

    it('should display required error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(categoryMessages.required)).toBeVisible(),
      );
      expect(onCategorySubmitMock).not.toBeCalled();
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
      expect(onCategorySubmitMock).not.toBeCalled();
    });
  });

  describe('success submission', () => {
    it('should reset the form', async () => {
      const { getByRole, getByText } = render(
        <CategoryForm onCategorySubmit={onCategorySubmitMock} />,
      );

      fireEvent.submit(getByRole('button'));
      fireEvent.change(getByRole('textbox'), { target: { value: 'green' } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onCategorySubmitMock).toBeCalledTimes(1));
      expect(onCategorySubmitMock).toBeCalledWith({ name: 'green' });
      expect(getByRole('textbox')).toHaveValue('');
      expect(getByText('numele categoriei')).toBeVisible();
    });
  });

  describe('server validation', () => {
    it('should display already exist error', async () => {
      onCategorySubmitMock.mockResolvedValueOnce([
        { message: categoryMessages.exists, name: 'name' },
      ]);

      const { getByRole, getByText } = render(
        <CategoryForm onCategorySubmit={onCategorySubmitMock} />,
      );

      fireEvent.change(getByRole('textbox'), { target: { value: 'green' } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onCategorySubmitMock).toBeCalledTimes(1));
      expect(onCategorySubmitMock).toBeCalledWith({ name: 'green' });
      expect(getByText(categoryMessages.exists)).toBeVisible();
    });
  });
});
