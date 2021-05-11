import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/utils/test-utils';
import ProductForm from '@/shared/ProductForm';
import { Category, ProductFields, Product, ProductErrorDetail } from 'types';
import { productMessages } from '@/utils/validator/schemas/product';

const onProductSubmitMock = jest.fn(
  (): Promise<ProductErrorDetail[] | undefined> => Promise.resolve(undefined),
);

const categories: Category[] = [
  { _id: 'c1', name: 'green' },
  { _id: 'c2', name: 'fruit' },
];

describe('ProductForm', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ProductForm
        onProductSubmit={onProductSubmitMock}
        categories={categories}
      />,
    );

    expect(screen.getByRole('textbox', { name: /nume produs/i })).toHaveValue(
      '',
    );

    expect(
      screen.getByRole('spinbutton', { name: /preț \(lei\)/i }),
    ).toHaveValue(0);

    expect(
      screen.getByRole('spinbutton', { name: /preț per cantitate \(g\)/i }),
    ).toHaveValue(0);

    expect(
      screen.getByRole('spinbutton', { name: /cantitatea totală \(g\)/i }),
    ).toHaveValue(0);

    expect(screen.getByRole('textbox', { name: /descriere/i })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: /categorie/i })).toHaveValue(
      categories[0]._id,
    );

    expect(screen.getAllByRole('option')).toHaveLength(categories.length);
    expect(screen.getByLabelText(/Încarcă imagine/i)).toHaveValue('');
    expect(
      screen.getByRole('checkbox', { name: /recomandată/i }),
    ).not.toBeChecked();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('has optional product prop for initial values', () => {
    const product: Product = {
      _id: 'p1',
      category_id: categories[0]._id,
      description: 'sweet tea',
      name: 'Green Tea',
      price: 69,
      quantity: 50,
      recommend: true,
      src: '',
      total_quantity: 34500,
    };

    render(
      <ProductForm
        onProductSubmit={onProductSubmitMock}
        categories={categories}
        product={product}
      />,
    );

    expect(screen.getByRole('textbox', { name: /nume produs/i })).toHaveValue(
      product.name,
    );

    expect(
      screen.getByRole('spinbutton', { name: /preț \(lei\)/i }),
    ).toHaveValue(product.price);

    expect(
      screen.getByRole('spinbutton', { name: /preț per cantitate \(g\)/i }),
    ).toHaveValue(product.quantity);

    expect(
      screen.getByRole('spinbutton', { name: /cantitatea totală \(g\)/i }),
    ).toHaveValue(product.total_quantity);

    expect(screen.getByRole('textbox', { name: /descriere/i })).toHaveValue(
      product.description,
    );
    expect(screen.getByRole('combobox', { name: /categorie/i })).toHaveValue(
      product.category_id,
    );
    expect(screen.getByLabelText(/Încarcă imagine/i)).toHaveValue(product.src);
    expect(
      screen.getByRole('checkbox', { name: /recomandată/i }),
    ).toBeChecked();
  });

  describe('fields validation', () => {
    beforeEach(() =>
      render(
        <ProductForm
          onProductSubmit={onProductSubmitMock}
          categories={categories}
        />,
      ),
    );

    describe('name field', () => {
      it('should display required error', async () => {
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.name.required),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display max length error', async () => {
        userEvent.type(
          screen.getByRole('textbox', { name: /nume produs/i }),
          'more than 60 chars|111111111111111111111111111111111111111111',
        );
        userEvent.click(screen.getByRole('button'));

        expect(await screen.findByText(productMessages.name.max)).toBeVisible();
        expect(onProductSubmitMock).not.toBeCalled();
      });
    });

    describe('price field', () => {
      it('should display negative number error', async () => {
        userEvent.type(
          screen.getByRole('spinbutton', { name: /preț \(lei\)/i }),
          '{backspace}-1',
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.price.min),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display invalid error', async () => {
        const priceInput = screen.getByRole('spinbutton', {
          name: /preț \(lei\)/i,
        });

        // big number
        userEvent.type(priceInput, '9007199254740992');

        expect(
          await screen.findByText(productMessages.price.invalid),
        ).toBeVisible();

        // empty field
        userEvent.type(priceInput, '{backspace}', { initialSelectionEnd: -1 });
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.price.invalid),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display type error', async () => {
        userEvent.type(
          screen.getByRole('spinbutton', { name: /preț \(lei\)/i }),
          'not a number',
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.price.type),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });
    });

    describe('quantity field', () => {
      it('should display negative number error', async () => {
        userEvent.type(
          screen.getByRole('spinbutton', { name: /preț per cantitate \(g\)/i }),
          '{backspace}-1',
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.quantity.min),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display invalid error', async () => {
        const quantityInput = screen.getByRole('spinbutton', {
          name: /preț per cantitate \(g\)/i,
        });

        // big number
        userEvent.type(quantityInput, '9007199254740992');

        expect(
          await screen.findByText(productMessages.quantity.invalid),
        ).toBeVisible();

        // empty field
        userEvent.type(quantityInput, '{backspace}', {
          initialSelectionEnd: -1,
        });
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.quantity.invalid),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display type error', async () => {
        userEvent.type(
          screen.getByRole('spinbutton', {
            name: /preț per cantitate \(g\)/i,
          }),
          'not a number',
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.quantity.type),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });
    });

    describe('total_quantity field', () => {
      it('should display negative number error', async () => {
        userEvent.type(
          screen.getByRole('spinbutton', { name: /cantitatea totală \(g\)/i }),
          '{backspace}-1',
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.total_quantity.min),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display invalid error', async () => {
        const totalQuantityInput = screen.getByRole('spinbutton', {
          name: /cantitatea totală \(g\)/i,
        });

        // big number
        userEvent.type(totalQuantityInput, '9007199254740992');

        expect(
          await screen.findByText(productMessages.total_quantity.invalid),
        ).toBeVisible();

        // empty field
        userEvent.type(totalQuantityInput, '{backspace}', {
          initialSelectionEnd: -1,
        });
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.total_quantity.invalid),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display type error', async () => {
        userEvent.type(
          screen.getByRole('spinbutton', { name: /cantitatea totală \(g\)/i }),
          'not a number',
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.total_quantity.type),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });
    });

    describe('description field', () => {
      it('should display required error', async () => {
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.description.required),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });

      it('should display max length error', async () => {
        const hugeDescription =
          'More than 2000 chars|sit amet, consectetur adipiscing elit. Quisque porta congue nisl sed imperdiet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis in erat velit. Nulla magna velit, auctor sed ornare ac, laoreet tristique dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi erat ex, efficitur sit amet vulputate nec, bibendum ut tellus. Curabitur ac interdum metus. Duis nec elit eget nisi ultrices eleifend in eu odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta congue nisl sed imperdiet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis in erat velit. Nulla magna velit, auctor sed ornare ac, laoreet tristique dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi erat ex, efficitur sit amet vulputate nec, bibendum ut tellus. Curabitur ac interdum metus. Duis nec elit eget nisi ultrices eleifend in eu odio.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta congue nisl sed imperdiet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis in erat velit. Nulla magna velit, auctor sed ornare ac, laoreet tristique dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi erat ex, efficitur sit amet vulputate nec, bibendum ut tellus. Curabitur ac interdum metus. Duis nec elit eget';
        userEvent.type(
          screen.getByRole('textbox', { name: /descriere/i }),
          hugeDescription,
        );
        userEvent.click(screen.getByRole('button'));

        expect(
          await screen.findByText(productMessages.description.max),
        ).toBeVisible();

        expect(onProductSubmitMock).not.toBeCalled();
      });
    });

    describe('category_id field', () => {
      it('should display no category', async () => {
        cleanup();

        render(
          <ProductForm onProductSubmit={onProductSubmitMock} categories={[]} />,
        );

        userEvent.click(screen.getByRole('button'));

        expect(await screen.findByText('no category')).toBeVisible();
        expect(onProductSubmitMock).not.toBeCalled();
      });
    });
  });

  describe('success submision', () => {
    it('should reset the form', async () => {
      const product: ProductFields & { src: string } = {
        category_id: categories[1]._id,
        description: 'sweet tea',
        name: 'Green Tea',
        price: 69,
        quantity: 50,
        recommend: true,
        src: 'tea.png',
        total_quantity: 34500,
      };

      render(
        <ProductForm
          onProductSubmit={onProductSubmitMock}
          categories={categories}
        />,
      );

      const nameInput = screen.getByRole('textbox', { name: /nume produs/i });
      const priceInput = screen.getByRole('spinbutton', {
        name: /preț \(lei\)/i,
      });
      const qunatityInput = screen.getByRole('spinbutton', {
        name: /preț per cantitate \(g\)/i,
      });
      const totalQuantityInput = screen.getByRole('spinbutton', {
        name: /cantitatea totală \(g\)/i,
      });
      const descriptionInput = screen.getByRole('textbox', {
        name: /descriere/i,
      });
      const categorySelect = screen.getByRole('combobox', {
        name: /categorie/i,
      });
      const fileInput = screen.getByLabelText(/Încarcă imagine/i);
      const recommendationInput = screen.getByRole('checkbox', {
        name: /recomandată/i,
      });

      userEvent.type(nameInput, product.name);
      userEvent.type(priceInput, `{backspace}${product.price}`);
      userEvent.type(qunatityInput, `{backspace}${product.quantity}`);
      userEvent.type(
        totalQuantityInput,
        `{backspace}${product.total_quantity}`,
      );
      userEvent.type(descriptionInput, product.description);
      userEvent.selectOptions(categorySelect, product.category_id);
      userEvent.upload(
        fileInput,
        new File(['tea img'], product.src, { type: 'image/png' }),
      );
      userEvent.click(recommendationInput);
      userEvent.click(screen.getByRole('button'));

      await waitFor(() => expect(onProductSubmitMock).toBeCalled());

      expect(nameInput).toHaveValue('');
      expect(priceInput).toHaveValue(0);
      expect(qunatityInput).toHaveValue(0);
      expect(totalQuantityInput).toHaveValue(0);
      expect(descriptionInput).toHaveValue('');
      expect(recommendationInput).not.toBeChecked();
      expect(categorySelect).toHaveValue(categories[0]._id);
      expect(fileInput).toHaveValue('');
    });
  });

  describe('server validation', () => {
    it('should display server validation errors', async () => {
      const product: Product = {
        _id: 'p1',
        category_id: categories[0]._id,
        description: 'sweet tea',
        name: 'Green Tea',
        price: 69,
        quantity: 50,
        recommend: true,
        src: '',
        total_quantity: 34500,
      };

      // pretend user bypass client validation
      onProductSubmitMock.mockResolvedValueOnce([
        { message: productMessages.name.required, name: 'name' },
        { message: productMessages.price.invalid, name: 'price' },
        { message: productMessages.quantity.min, name: 'quantity' },
        {
          message: productMessages.total_quantity.type,
          name: 'total_quantity',
        },
        { message: productMessages.description.max, name: 'description' },
        { message: productMessages.category_id.invalid, name: 'category_id' },
        { message: productMessages.src.max, name: 'src' },
      ]);

      render(
        <ProductForm
          onProductSubmit={onProductSubmitMock}
          categories={categories}
        />,
      );

      const nameInput = screen.getByRole('textbox', { name: /nume produs/i });
      const priceInput = screen.getByRole('spinbutton', {
        name: /preț \(lei\)/i,
      });
      const qunatityInput = screen.getByRole('spinbutton', {
        name: /preț per cantitate \(g\)/i,
      });
      const totalQuantityInput = screen.getByRole('spinbutton', {
        name: /cantitatea totală \(g\)/i,
      });
      const descriptionInput = screen.getByRole('textbox', {
        name: /descriere/i,
      });
      const categorySelect = screen.getByRole('combobox', {
        name: /categorie/i,
      });
      const fileInput = screen.getByLabelText(/Încarcă imagine/i);
      const recommendationInput = screen.getByRole('checkbox', {
        name: /recomandată/i,
      });

      userEvent.type(nameInput, product.name);
      userEvent.type(priceInput, `{backspace}${product.price}`);
      userEvent.type(qunatityInput, `{backspace}${product.quantity}`);
      userEvent.type(
        totalQuantityInput,
        `{backspace}${product.total_quantity}`,
      );
      userEvent.type(descriptionInput, product.description);
      userEvent.selectOptions(categorySelect, product.category_id);
      userEvent.upload(
        fileInput,
        new File(['tea img'], product.src, { type: 'image/png' }),
      );
      userEvent.click(recommendationInput);
      userEvent.click(screen.getByRole('button'));

      await waitFor(() => expect(onProductSubmitMock).toBeCalled());

      expect(screen.getByText(productMessages.name.required)).toBeVisible();
      expect(screen.getByText(productMessages.price.invalid)).toBeVisible();
      expect(screen.getByText(productMessages.quantity.min)).toBeVisible();
      expect(
        screen.getByText(productMessages.total_quantity.type),
      ).toBeVisible();
      expect(screen.getByText(productMessages.description.max)).toBeVisible();
      expect(
        screen.getByText(productMessages.category_id.invalid),
      ).toBeVisible();
      expect(screen.getByText(productMessages.src.max)).toBeVisible();

      // form still has old values
      expect(nameInput).toHaveValue(product.name);
    });
  });
});
