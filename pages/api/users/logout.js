import Token from 'models/Token';
import { removeSession } from 'lib/session';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        await Token.findOneAndDelete({ refresh_token: req.cookies.refresh });
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
}
