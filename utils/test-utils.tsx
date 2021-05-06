import { render, RenderOptions } from '@testing-library/react';
import GlobalStyle from 'GlobalStyle';
import { UserSession } from 'types';
import { SessionProvider } from 'contexts/SessionContext';

const Wrapper: React.FC = ({ children }) => (
  <>
    <GlobalStyle />
    {children}
  </>
);

type Options = Omit<RenderOptions, 'queries'>;

const customRender = (ui: React.ReactElement, options?: Options) =>
  render(ui, { wrapper: Wrapper, ...options });

const renderWithSession = (
  ui: React.ReactElement,
  session: UserSession,
  options?: Options,
) => {
  const { rerender, ...all } = customRender(
    <SessionProvider session={session}>{ui}</SessionProvider>,
    options,
  );

  const rerenderWithSession = (
    rerenderUI: React.ReactElement,
    rerenderSession: UserSession,
  ) =>
    rerender(
      <SessionProvider session={rerenderSession}>{rerenderUI}</SessionProvider>,
    );

  return { ...all, rerender, rerenderWithSession };
};

export * from '@testing-library/react';

export { customRender as render, renderWithSession };
