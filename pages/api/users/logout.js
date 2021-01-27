import Session from '@/models/Session';
import { removeSession } from 'lib/session';
import { withSession } from '@/utils/withSession';

export default withSession(async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        await Session.findOneAndDelete(
          { user_id: req.session.user._id },
          { returnOriginal: false }
        );
        const cookies = removeSession();

        res.setHeader('Set-Cookie', cookies);
        res
          .status(200)
          .json({ success: true, message: 'Deconectare cu succes' });
      } catch (error) {
        res.status(400).json({ success: false, message: 'Bad Request' });
      }

      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });
      break;
  }
});
