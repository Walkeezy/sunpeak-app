import { google } from 'googleapis';

export type WebcamData = Webcam[];

export type Webcam = {
  name: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  fullsize: string;
  link: string;
  panorama: boolean;
};

export async function getWebcamData(): Promise<WebcamData | null> {
  try {
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      undefined,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      target
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Webcams',
    });

    const rows = response.data.values;
    const data: WebcamData = [];

    if (rows && rows.length) {
      rows.shift(); // remove header row
      rows.forEach((row) => {
        const isActive = row[9] === 'TRUE';
        if (isActive) {
          const latitude = parseFloat(row[3]);
          const longitude = parseFloat(row[4]);
          const fullsize = row[6];
          if (latitude && longitude && fullsize) {
            data.push({
              name: row[0],
              city: row[1],
              region: row[2],
              latitude,
              longitude,
              thumbnail: row[5] === '' ? fullsize : row[5],
              fullsize,
              link: row[7] === '' ? fullsize : row[7],
              panorama: row[8] === 'TRUE',
            });
          }
        }
      });
    }

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
