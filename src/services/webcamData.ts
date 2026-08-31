import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';
import { FETCH_TIMEOUT_MS } from '../config';

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

async function loadWebcamData(): Promise<WebcamData> {
  const jwt = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth: jwt });
  const response = await sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Webcams',
    },
    { timeout: FETCH_TIMEOUT_MS },
  );

  // Sheets returns formatted values, so every cell is a string
  const rows = (response.data.values ?? []) as string[][];

  return rows
    .slice(1) // skip header row
    .filter((row) => row[9] === 'TRUE') // only active webcams
    .flatMap((row) => {
      const latitude = parseFloat(row[3]);
      const longitude = parseFloat(row[4]);
      const fullsize = row[6];

      if (!latitude || !longitude || !fullsize) {
        return [];
      }

      return {
        name: row[0],
        city: row[1],
        region: row[2],
        latitude,
        longitude,
        thumbnail: row[5] === '' ? fullsize : row[5],
        fullsize,
        link: row[7] === '' ? fullsize : row[7],
        panorama: row[8] === 'TRUE',
      };
    });
}

export const getWebcamData = unstable_cache(loadWebcamData, ['webcam-data'], {
  revalidate: 3600,
  tags: ['webcams'],
});
