import { createContext, useContext } from 'react';
import { UserSession } from 'types';

const SessionContext = createContext<UserSession>({} as UserSession);

type SessionProviderProps = {
  session: UserSession;
};

const SessionProvider = ({
  children,
  session,
}: React.PropsWithChildren<SessionProviderProps>) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
};

export { SessionProvider, useSession };
