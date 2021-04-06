import { verifySession, SessionAuth } from '@/utils/verifySession';
import type {
  NextApiRequest,
  NextApiResponse,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

interface NextApiSessionRequest extends NextApiRequest {
  session: SessionAuth;
}

type ApiProps = [NextApiSessionRequest, NextApiResponse];

type ServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GetServerSidePropsContext<Q> & {
  req: {
    session: SessionAuth;
  };
};

type ServerSideProps<
  Z extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GetServerSideProps<Z, Q> extends (context: infer P) => infer R
  ? (
      context: P & {
        req: {
          session: SessionAuth;
        };
      },
    ) => R
  : never;

export const withSessionApi = <T = any>(
  cb: (req: NextApiSessionRequest, res: NextApiResponse<T>) => Promise<void>,
) => {
  return async (...args: ApiProps) => {
    const [req, res] = args;

    if (req.cookies) {
      const [session, cookies] = await verifySession({ cookies: req.cookies });
      if (cookies) res.setHeader('Set-Cookie', cookies);
      req.session = session;
    }

    return cb(req, res);
  };
};

export const withSessionServerSideProps = <
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(
  cb: ServerSideProps<Q, P>,
) => {
  return async (context: ServerSidePropsContext<P>) => {
    const { req, res } = context;

    if (req.cookies) {
      const [session, cookies] = await verifySession({ cookies: req.cookies });
      if (cookies) res.setHeader('Set-Cookie', cookies);
      context.req.session = session;
    }

    return cb(context);
  };
};

/**
 *
 * @deprecated
 */
export const withSession = (cb: any) => {
  return async (...args: any) => {
    const req: {
      cookies: { [key: string]: string };
      session: SessionAuth;
    } = args[0] && args[1] ? args[0] : args[0].req;
    const res = args[0] && args[1] ? args[1] : args[0].res;

    if (req) {
      const [session, cookies] = await verifySession({ cookies: req.cookies });
      if (cookies) res.setHeader('Set-Cookie', cookies);
      req.session = session;
    }

    return cb(...args);
  };
};
