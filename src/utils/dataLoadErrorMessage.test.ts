import { describe, expect, test } from 'vitest';
import { dataLoadErrorMessage } from './dataLoadErrorMessage';

describe('dataLoadErrorMessage', () => {
  test('returns null when every source succeeded', () => {
    expect(dataLoadErrorMessage(true, true, true)).toBeNull();
  });

  test('names a webcam failure', () => {
    expect(dataLoadErrorMessage(false, true, true)).toBe('Webcam list could not be loaded');
  });

  test('names a weather failure when temperature or wind failed', () => {
    expect(dataLoadErrorMessage(true, false, true)).toBe('Weather data could not be loaded');
    expect(dataLoadErrorMessage(true, true, false)).toBe('Weather data could not be loaded');
  });

  test('joins webcam and weather failures', () => {
    expect(dataLoadErrorMessage(false, false, false)).toBe(
      'Webcam list could not be loaded. Weather data could not be loaded',
    );
  });
});
