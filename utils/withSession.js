import { verifySession } from '@/utils/verifySession';

export const withSession = (cb) => {
  return async (...args) => {
    const req = args[0] && args[1] ? args[0] : args[0].req;
    const res = args[0] && args[1] ? args[1] : args[0].res;

    const [session, cookies] = await verifySession(req.cookies);

    if (cookies) res.setHeader('Set-Cookie', cookies);

    req.session = session;
    return cb(...args);
  };
};
