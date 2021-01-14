import { removeSession } from 'lib/session';

export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const [session, auth] = removeSession();

      res.setHeader('Set-Cookie', [session, auth]);
      res.status(200).json({ success: true, message: 'Deconectare cu succes' });

      break;

    default:
      res.status(400).json({ success: false, message: 'Bad Request' });
      break;
  }
}
