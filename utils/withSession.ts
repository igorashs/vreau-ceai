import verifySession from '@/utils/verifySession';
import type {
  NextApiRequest,
  NextApiResponse,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { SessionAuth } from 'types';

export type NextApiSessionRequest = NextApiRequest & {
  session?: SessionAuth;
};

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
