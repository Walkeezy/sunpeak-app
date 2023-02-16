import { NextApiRequest, NextApiResponse } from 'next';
import { getWebcamData } from '../../services/sheet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const webcamData = await getWebcamData();
    if (webcamData) {
      res.status(200).json(webcamData);
    } else {
      throw new Error('Error fetching webcam data.');
    }
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}
