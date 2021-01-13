import cookie from 'cookie';

export const removeSession = () => {
  const sessionCookie = cookie.serialize('session', '', {
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  const authCookie = cookie.serialize('auth', '', {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });

  return [sessionCookie, authCookie];
};
