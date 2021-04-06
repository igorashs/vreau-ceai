import SessionModel from '@/models/Session';
import { removeSession } from 'lib/session';
import { withSessionApi } from '@/utils/withSession';
import { ApiResponse } from 'types';

export default withSessionApi<ApiResponse>(async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        await SessionModel.findOneAndDelete(
          { user_id: req.session.user?._id },
          { returnOriginal: false },
        );
        const cookies = removeSession();

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
