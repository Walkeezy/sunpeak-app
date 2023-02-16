import { describe, expect, test } from 'vitest';
import { getDesignTokensByZoom } from './getDesignTokensByZoom';

describe('getDesignTokensByZoom', () => {
  const data = [
    {
      zoom: 10,
      expected: {
        camSize: 40,
        arrowSize: 6,
        borderRadius: 'rounded-xl',
      },
    },
    {
      zoom: 11,
      expected: {
        camSize: 50,
        arrowSize: 8,
        borderRadius: 'rounded-xl',
      },
    },
  ];

  test.each(data)('return design tokens correctly', ({ zoom, expected }) => {
    expect(getDesignTokensByZoom(zoom)).toStrictEqual(expected);
  });
});
