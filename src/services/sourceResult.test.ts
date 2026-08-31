import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { settle } from './sourceResult';

describe('settle', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns data and ok when the promise resolves', async () => {
    await expect(settle(Promise.resolve([1, 2]), [])).resolves.toEqual({ data: [1, 2], ok: true });
    expect(console.error).not.toHaveBeenCalled();
  });

  test('returns fallback and not ok when the promise rejects', async () => {
    const error = new Error('failed');

    await expect(settle(Promise.reject(error), [])).resolves.toEqual({ data: [], ok: false });
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
