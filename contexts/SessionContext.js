import { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

function SessionProvider({ children, session }) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}

export { SessionProvider, useSession };
