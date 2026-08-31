import { afterEach, describe, expect, test, vi } from 'vitest';
import { getWindData, parseWindDirections } from './windData';

const gustFeatures = [
  { id: 'calm', geometry: { coordinates: [2_600_000, 1_200_000] }, properties: { value: 5 } },
  { id: 'storm', geometry: { coordinates: [2_600_000, 1_200_000] }, properties: { value: 130 } },
];

const vqha80 = `Station/Location;Date;tre200s0;dkl010z0;fu3010z1
calm;202608311400;12.0;180;5
storm;202608311400;8.0;-;130
other;202608311400;10.0;90;20
`;

const mockFetches = ({ csv = vqha80, csvOk = true }: { csv?: string; csvOk?: boolean } = {}) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(async (url: string) => {
      if (String(url).includes('VQHA80')) {
        if (!csvOk) {
          return { ok: false, status: 500, text: async () => '' };
        }

        return { ok: true, text: async () => csv };
      }

      return {
        ok: true,
        json: async () => ({ features: gustFeatures }),
      };
    }),
  );
};

describe('parseWindDirections', () => {
  test('maps station ids to finite directions and skips missing values', () => {
    const directions = parseWindDirections(vqha80);

    expect(Object.fromEntries(directions)).toEqual({ calm: 180, other: 90 });
  });

  test('returns an empty map when the direction column is missing', () => {
    expect(parseWindDirections('Station/Location;Date\ncalm;202608311400')).toEqual(new Map());
  });

  test('parses the live VQHA80 header and decimal directions', () => {
    const csv = `Station/Location;Date;tre200s0;rre150z0;sre000z0;gre000z0;ure200s0;tde200s0;dkl010z0;fu3010z0;fu3010z1
TAE;202608311710;22.20;0.00;10.00;157.00;46.30;10.10;301.00;9.40;21.20
AIG;202608311710;-;-;1.00;104.00;-;-;335.00;8.60;18.40
`;

    expect(Object.fromEntries(parseWindDirections(csv))).toEqual({ TAE: 301, AIG: 335 });
  });
});

describe('getWindData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('returns all measurements without filtering and joins direction by station id', async () => {
    mockFetches();

    const data = await getWindData();

    expect(data.map(({ id, value, direction }) => ({ id, value, direction }))).toEqual([
      { id: 'calm', value: 5, direction: 180 },
      { id: 'storm', value: 130, direction: undefined },
    ]);
  });

  test('returns gusts without direction when the CSV fetch fails', async () => {
    mockFetches({ csvOk: false });

    const data = await getWindData();

    expect(data.map(({ id, direction }) => ({ id, direction }))).toEqual([
      { id: 'calm', direction: undefined },
      { id: 'storm', direction: undefined },
    ]);
  });
});
