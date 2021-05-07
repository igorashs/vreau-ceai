import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';
import FindProductForm from '@/shared/FindProductForm';
import { ProductNameErrorDetail } from 'types';
import { productMessages } from '@/utils/validator/schemas/product';

const onFindProductSubmitMock = jest.fn(
  (): Promise<ProductNameErrorDetail[] | undefined> =>
    Promise.resolve(undefined),
);

describe('FindProductForm', () => {
  it('renders correctly', () => {
    const { container, getByRole } = render(
      <FindProductForm onFindProductSubmit={onFindProductSubmitMock} />,
    );

    expect(getByRole('textbox')).toHaveValue('');
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('name validation', () => {
    beforeEach(() =>
      render(<FindProductForm onFindProductSubmit={onFindProductSubmitMock} />),
    );

    it('should display required error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(productMessages.name.required)).toBeVisible(),
      );

      expect(onFindProductSubmitMock).not.toBeCalled();
    });

    it('should display max length error', async () => {
      const { getByRole, getByText } = screen;

      fireEvent.change(getByRole('textbox'), {
        target: {
          value:
            'More than 16 characters|1111111111111111111111111111111111111',
        },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() =>
        expect(getByText(productMessages.name.max)).toBeVisible(),
      );

      expect(onFindProductSubmitMock).not.toBeCalled();
    });
  });

  describe('success submission', () => {
    it('should reset the form', async () => {
      const { getByRole, getByText } = render(
        <FindProductForm onFindProductSubmit={onFindProductSubmitMock} />,
      );

      const name = 'Green Tea';

      fireEvent.submit(getByRole('button'));
      fireEvent.change(getByRole('textbox'), { target: { value: name } });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindProductSubmitMock).toBeCalledTimes(1));
      expect(onFindProductSubmitMock).toBeCalledWith({ name });
      expect(getByRole('textbox')).toHaveValue(name);
      expect(getByText('numele produsului')).toBeVisible();
    });
  });

  describe('server validation', () => {
    it('should display required error', async () => {
      // pretend user bypass client validation
      onFindProductSubmitMock.mockResolvedValueOnce([
        { message: productMessages.name.required, name: 'name' },
      ]);

      const { getByRole, getByText } = render(
        <FindProductForm onFindProductSubmit={onFindProductSubmitMock} />,
      );

      fireEvent.change(getByRole('textbox'), {
        target: { value: 'Green Tea' },
      });
      fireEvent.submit(getByRole('button'));

      await waitFor(() => expect(onFindProductSubmitMock).toBeCalledTimes(1));
      expect(onFindProductSubmitMock).toBeCalledWith({ name: 'Green Tea' });
      expect(getByText(productMessages.name.required)).toBeVisible();
    });
  });
});
