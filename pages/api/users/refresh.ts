import verifySession, { SessionAuth } from '@/utils/verifySession';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from 'types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse & { session?: SessionAuth }>,
) {
  switch (req.method) {
    case 'POST':
      try {
        const [session, cookies] = await verifySession({
          cookies: req.cookies,
          updateAccess: true,
        });

        if (cookies) res.setHeader('Set-Cookie', cookies);

        res.status(session.isAuth ? 200 : 401).json({
          success: session.isAuth,
          message: session.isAuth ? 'auth updated' : 'unauthorized',
          session,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request' });
      }

      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });
      break;
  }
}
