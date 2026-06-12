import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getWebcamData } from './webcamData';

const { valuesGet } = vi.hoisted(() => ({ valuesGet: vi.fn() }));

vi.mock('googleapis', () => ({
  google: {
    auth: { JWT: vi.fn() },
    sheets: vi.fn(() => ({ spreadsheets: { values: { get: valuesGet } } })),
  },
}));

const header = ['Name', 'City', 'Region', 'Latitude', 'Longitude', 'Thumbnail', 'Fullsize', 'Link', 'Panorama', 'Active'];

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
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

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

  test('returns empty array when the Sheets API fails', async () => {
    valuesGet.mockRejectedValue(new Error('api error'));

    await expect(getWebcamData()).resolves.toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});
