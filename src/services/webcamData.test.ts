import { afterEach, describe, expect, test, vi } from 'vitest';
import { FETCH_TIMEOUT_MS } from '@/config';
import { getWebcamData } from './webcamData';

const { valuesGet } = vi.hoisted(() => ({ valuesGet: vi.fn() }));

vi.mock('next/cache', () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock('googleapis', () => ({
  google: {
    auth: { JWT: vi.fn() },
    sheets: vi.fn(() => ({ spreadsheets: { values: { get: valuesGet } } })),
  },
}));

const header = ['Name', 'Ort', 'Kanton', 'Latitude', 'Longitude', 'Thumbnail', 'Medium', 'Link', 'Panorama', 'Active'];

const row = (overrides: Partial<Record<number, string>> = {}) => {
  const base = [
    'Cam',
    'Zurich',
    'ZH',
    '47.37',
    '8.54',
    'https://example.com/thumb.jpg',
    'https://example.com/full.jpg',
    'https://example.com/link',
    'FALSE',
    'TRUE',
  ];

  return base.map((value, index) => overrides[index] ?? value);
};

describe('getWebcamData', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    valuesGet.mockReset();
  });

  test('maps active rows and skips the header row', async () => {
    valuesGet.mockResolvedValue({ data: { values: [header, row()] } });

    const data = await getWebcamData();

    expect(data).toEqual([
      {
        name: 'Cam',
        city: 'Zurich',
        region: 'ZH',
        latitude: 47.37,
        longitude: 8.54,
        thumbnail: 'https://example.com/thumb.jpg',
        fullsize: 'https://example.com/full.jpg',
        link: 'https://example.com/link',
        panorama: false,
      },
    ]);
    expect(valuesGet).toHaveBeenCalledWith(
      {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Webcams',
      },
      { timeout: FETCH_TIMEOUT_MS },
    );
  });

  test('skips inactive rows', async () => {
    valuesGet.mockResolvedValue({ data: { values: [header, row({ 9: 'FALSE' })] } });

    await expect(getWebcamData()).resolves.toEqual([]);
  });

  test('falls back to fullsize for empty thumbnail and link', async () => {
    valuesGet.mockResolvedValue({ data: { values: [header, row({ 5: '', 7: '' })] } });

    const [webcam] = await getWebcamData();

    expect(webcam.thumbnail).toBe('https://example.com/full.jpg');
    expect(webcam.link).toBe('https://example.com/full.jpg');
  });

  test('skips rows with missing coordinates or fullsize url', async () => {
    valuesGet.mockResolvedValue({
      data: { values: [header, row({ 3: '' }), row({ 4: 'not-a-number' }), row({ 6: '' })] },
    });

    await expect(getWebcamData()).resolves.toEqual([]);
  });

  test('maps columns by header name when they are reordered', async () => {
    const order = [9, 0, 6, 3, 4, 1, 2, 5, 7, 8];
    const reorder = (values: string[]) => order.map((index) => values[index]);
    valuesGet.mockResolvedValue({ data: { values: [reorder(header), reorder(row({ 8: 'TRUE' }))] } });

    const [webcam] = await getWebcamData();

    expect(webcam).toMatchObject({
      name: 'Cam',
      city: 'Zurich',
      latitude: 47.37,
      fullsize: 'https://example.com/full.jpg',
      panorama: true,
    });
  });

  test('works without optional columns', async () => {
    const keep = [0, 3, 4, 6, 9];
    const pick = (values: string[]) => keep.map((index) => values[index]);
    valuesGet.mockResolvedValue({ data: { values: [pick(header), pick(row())] } });

    const [webcam] = await getWebcamData();

    expect(webcam).toMatchObject({ city: '', thumbnail: 'https://example.com/full.jpg', panorama: false });
  });

  test('throws when a required column is missing', async () => {
    const withoutActive = header.slice(0, 9);
    valuesGet.mockResolvedValue({ data: { values: [withoutActive, row().slice(0, 9)] } });

    await expect(getWebcamData()).rejects.toThrow('Webcam sheet is missing required columns: Active');
  });

  test('throws when the Sheets API fails', async () => {
    valuesGet.mockRejectedValue(new Error('api error'));

    await expect(getWebcamData()).rejects.toThrow('api error');
  });
});
