import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from 'types';

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  res.status(400).json({ success: false, message: 'Bad Request' });
}
