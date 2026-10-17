import { describe, expect, test } from 'vitest';
import { mapWithConcurrency } from './mapWithConcurrency';

describe('mapWithConcurrency', () => {
  test('keeps the input order', async () => {
    const delays = [30, 5, 15, 0];
    const result = await mapWithConcurrency(delays, 2, async (delay, index) => {
      await new Promise((resolve) => setTimeout(resolve, delay));

      return index;
    });

    expect(result).toEqual([0, 1, 2, 3]);
  });

  test('never runs more than the limit at once', async () => {
    let running = 0;
    let peak = 0;

    await mapWithConcurrency([1, 2, 3, 4, 5, 6, 7], 3, async () => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((resolve) => setTimeout(resolve, 5));
      running--;
    });

    expect(peak).toBe(3);
  });

  test('handles an empty list', async () => {
    await expect(mapWithConcurrency([], 4, async () => 1)).resolves.toEqual([]);
  });
});
