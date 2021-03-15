import { createContext, useContext } from 'react';

type Session = {
  isAuth: boolean;
  user: {
    _id: string;
    name: string;
    isAdmin: boolean;
    isManager: boolean;
  };
  needRefresh: boolean;
};

const SessionContext = createContext<Session>({} as Session);

interface SessionProviderProps {
  session: any;
}

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
