import { withSessionApi } from '@/utils/withSession';
import { ApiResponse } from 'types';
import SessionService from 'services/SessionService';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        // respond 401 Unauthorized if user is not authenticated
        if (!req.session.isAuth || !req.session.user) {
          res.status(401).json({ success: false, message: 'Unauthorized' });

          return;
        }

        const cookies = await SessionService.deleteUserSession(
          req.session.user?._id,
        );

        res.setHeader('Set-Cookie', cookies);
        res.status(200).json({ success: true, message: 'Success' });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request' });
      }

      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });
      break;
  }
});
