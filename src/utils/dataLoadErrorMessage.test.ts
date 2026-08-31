import { describe, expect, test } from 'vitest';
import { dataLoadErrorMessage } from './dataLoadErrorMessage';

describe('dataLoadErrorMessage', () => {
  test('returns null when every source succeeded', () => {
    expect(dataLoadErrorMessage({ webcamOk: true, temperatureOk: true, windOk: true })).toBeNull();
  });

  test('names a webcam failure', () => {
    expect(dataLoadErrorMessage({ webcamOk: false, temperatureOk: true, windOk: true })).toBe(
      'Webcam list could not be loaded',
    );
  });

  test('names a weather failure when temperature or wind failed', () => {
    expect(dataLoadErrorMessage({ webcamOk: true, temperatureOk: false, windOk: true })).toBe(
      'Weather data could not be loaded',
    );
    expect(dataLoadErrorMessage({ webcamOk: true, temperatureOk: true, windOk: false })).toBe(
      'Weather data could not be loaded',
    );
  });

  test('joins webcam and weather failures', () => {
    expect(dataLoadErrorMessage({ webcamOk: false, temperatureOk: false, windOk: false })).toBe(
      'Webcam list could not be loaded. Weather data could not be loaded',
    );
  });
});
