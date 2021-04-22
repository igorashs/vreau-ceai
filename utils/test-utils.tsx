import { render, RenderOptions } from '@testing-library/react';
import GlobalStyle from 'GlobalStyle';

const Wrapper: React.FC = ({ children }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) => render(ui, { wrapper: Wrapper, ...options });

export * from '@testing-library/react';

export { customRender as render };
