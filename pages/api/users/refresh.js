import { verifySession } from '@/utils/verifySession';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const [session, cookies] = await verifySession(req.cookies, true);

        res.setHeader('Set-Cookie', cookies);

        res.status(session.isAuth ? 200 : 401).json({
          success: session.isAuth,
          message: session.isAuth ? 'auth updated' : 'unauthorized',
          session
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
