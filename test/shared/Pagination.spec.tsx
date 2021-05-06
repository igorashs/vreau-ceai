import { fireEvent, render } from '@/utils/test-utils';
import Pagination from '@/shared/Pagination';

describe('Pagination', () => {
  it('renders correctly', () => {
    const min = 1;
    const max = 3;
    const currPage = 1;
    const onPageChangeMock = jest.fn();

    const { container, getByTestId } = render(
      <Pagination
        min={min}
        max={max}
        currPage={currPage}
        onPageChange={onPageChangeMock}
      />,
    );

    const firstPageBtn = getByTestId('first-page');

    expect(firstPageBtn).toHaveTextContent(min.toString());
    expect(firstPageBtn).toHaveStyleRule('color', 'var(--text-dark)');
    expect(firstPageBtn).toHaveAttribute('disabled');

    const lastPageBtn = getByTestId('last-page');

    expect(lastPageBtn).toHaveTextContent(max.toString());
    expect(lastPageBtn).toHaveStyleRule('color', 'var(--accent-text-dark)');
    expect(lastPageBtn).not.toHaveAttribute('disabled');

    expect(getByTestId('curr-page')).toHaveTextContent(currPage.toString());
    expect(getByTestId('prev-page')).toHaveAttribute('disabled');
    expect(getByTestId('next-page')).not.toHaveAttribute('disabled');

    expect(container.firstChild).toMatchSnapshot();
  });

  it("doesn't render with 1 or less max pages", () => {
    const onPageChangeMock = jest.fn();

    const { container } = render(
      <Pagination
        min={1}
        max={1}
        currPage={1}
        onPageChange={onPageChangeMock}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  describe('onPageChange prop', () => {
    describe('.onPrevPageClick', () => {
      it('returns prev page number', () => {
        const min = 1;
        const max = 3;
        const currPage = 2;
        const onPageChangeMock = jest.fn();

        const { getByTestId } = render(
          <Pagination
            min={min}
            max={max}
            currPage={currPage}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(getByTestId('prev-page'));

        expect(onPageChangeMock).toBeCalledTimes(1);
        expect(onPageChangeMock).toBeCalledWith(currPage - 1);
      });

      it('respects min/max props limits', () => {
        const min = 1;
        const max = 3;
        const currPage = 1;
        const onPageChangeMock = jest.fn();

        const { getByTestId, rerender } = render(
          <Pagination
            min={min}
            max={max}
            currPage={currPage}
            onPageChange={onPageChangeMock}
          />,
        );

        const prevPageBtn = getByTestId('prev-page');
        fireEvent.click(prevPageBtn);

        expect(prevPageBtn).toHaveAttribute('disabled');

        rerender(
          <Pagination
            min={min}
            max={max}
            currPage={5}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(prevPageBtn);

        expect(onPageChangeMock).toBeCalledWith(max - 1);

        rerender(
          <Pagination
            min={min}
            max={max}
            currPage={0}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(prevPageBtn);

        expect(prevPageBtn).toHaveAttribute('disabled');
        expect(onPageChangeMock).toBeCalledTimes(1);
      });
    });

    describe('.onNextPageClick', () => {
      it('returns next page number', () => {
        const min = 1;
        const max = 3;
        const currPage = 2;
        const onPageChangeMock = jest.fn();

        const { getByTestId } = render(
          <Pagination
            min={min}
            max={max}
            currPage={currPage}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(getByTestId('next-page'));

        expect(onPageChangeMock).toBeCalledTimes(1);
        expect(onPageChangeMock).toBeCalledWith(currPage + 1);
      });

      it('respects min/max props limits', () => {
        const min = 1;
        const max = 3;
        const currPage = 3;
        const onPageChangeMock = jest.fn();

        const { getByTestId, rerender } = render(
          <Pagination
            min={min}
            max={max}
            currPage={currPage}
            onPageChange={onPageChangeMock}
          />,
        );

        const nextPageBtn = getByTestId('next-page');
        fireEvent.click(nextPageBtn);

        expect(nextPageBtn).toHaveAttribute('disabled');

        rerender(
          <Pagination
            min={min}
            max={max}
            currPage={0}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(nextPageBtn);

        expect(onPageChangeMock).toBeCalledWith(min + 1);

        rerender(
          <Pagination
            min={min}
            max={max}
            currPage={5}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(nextPageBtn);

        expect(nextPageBtn).toHaveAttribute('disabled');
        expect(onPageChangeMock).toBeCalledTimes(1);
      });
    });

    describe('.onFirstPageClick', () => {
      it('returns min page number', () => {
        const min = 1;
        const max = 3;
        const currPage = 3;
        const onPageChangeMock = jest.fn();

        const { getByTestId } = render(
          <Pagination
            min={min}
            max={max}
            currPage={currPage}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(getByTestId('first-page'));

        expect(onPageChangeMock).toBeCalledTimes(1);
        expect(onPageChangeMock).toBeCalledWith(min);
      });
    });

    describe('.onLastPageClick', () => {
      it('returns max page number', () => {
        const min = 1;
        const max = 3;
        const currPage = 2;
        const onPageChangeMock = jest.fn();

        const { getByTestId } = render(
          <Pagination
            min={min}
            max={max}
            currPage={currPage}
            onPageChange={onPageChangeMock}
          />,
        );

        fireEvent.click(getByTestId('last-page'));

        expect(onPageChangeMock).toBeCalledTimes(1);
        expect(onPageChangeMock).toBeCalledWith(max);
      });
    });
  });
});
