import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';
import { FETCH_TIMEOUT_MS } from '@/config';

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

// Columns are looked up by header name so reordering or adding columns in the Sheet is safe
const REQUIRED_COLUMNS = {
  name: 'Name',
  latitude: 'Latitude',
  longitude: 'Longitude',
  fullsize: 'Medium',
  active: 'Active',
} as const;

const OPTIONAL_COLUMNS = {
  city: 'Ort',
  region: 'Kanton',
  thumbnail: 'Thumbnail',
  link: 'Link',
  panorama: 'Panorama',
} as const;

type Columns = Record<keyof typeof REQUIRED_COLUMNS, number> & Partial<Record<keyof typeof OPTIONAL_COLUMNS, number>>;

const resolveColumns = (header: string[]): Columns => {
  const indexOf = (name: string) => {
    const index = header.findIndex((cell) => cell.trim() === name);

    return index === -1 ? undefined : index;
  };

  const missing = Object.values(REQUIRED_COLUMNS).filter((name) => indexOf(name) === undefined);
  if (missing.length > 0) {
    throw new Error(`Webcam sheet is missing required columns: ${missing.join(', ')}`);
  }

  const resolve = <T extends Record<string, string>>(columns: T) =>
    Object.fromEntries(Object.entries(columns).map(([key, name]) => [key, indexOf(name)]));

  return { ...resolve(REQUIRED_COLUMNS), ...resolve(OPTIONAL_COLUMNS) } as Columns;
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
  const [header = [], ...rows] = (response.data.values ?? []) as string[][];
  const column = resolveColumns(header);

  return rows
    .filter((row) => row[column.active] === 'TRUE') // only active webcams
    .flatMap((row) => {
      const cell = (index: number | undefined) => (index === undefined ? '' : (row[index] ?? ''));
      const latitude = parseFloat(cell(column.latitude));
      const longitude = parseFloat(cell(column.longitude));
      const fullsize = cell(column.fullsize);

      if (!latitude || !longitude || !fullsize) {
        return [];
      }

      return {
        name: cell(column.name),
        city: cell(column.city),
        region: cell(column.region),
        latitude,
        longitude,
        thumbnail: cell(column.thumbnail) || fullsize,
        fullsize,
        link: cell(column.link) || fullsize,
        panorama: cell(column.panorama) === 'TRUE',
      };
    });
}

export const getWebcamData = unstable_cache(loadWebcamData, ['webcam-data'], {
  revalidate: 3600,
  tags: ['webcams'],
});
