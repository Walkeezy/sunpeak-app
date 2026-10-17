import { describe, expect, test } from 'vitest';
import { en } from '@/messages/en';
import { dataLoadErrorMessage } from './dataLoadErrorMessage';

const messages = en.app.loadErrors;

describe('dataLoadErrorMessage', () => {
  test('returns null when every source succeeded', () => {
    expect(
      dataLoadErrorMessage({ webcamOk: true, temperatureOk: true, windOk: true, sunshineOk: true }, messages),
    ).toBeNull();
  });

  test('names a webcam failure', () => {
    expect(dataLoadErrorMessage({ webcamOk: false, temperatureOk: true, windOk: true, sunshineOk: true }, messages)).toBe(
      'Webcam list could not be loaded',
    );
  });

  test('names a weather failure when temperature or wind failed', () => {
    expect(dataLoadErrorMessage({ webcamOk: true, temperatureOk: false, windOk: true, sunshineOk: true }, messages)).toBe(
      'Weather data could not be loaded',
    );
    expect(dataLoadErrorMessage({ webcamOk: true, temperatureOk: true, windOk: false, sunshineOk: true }, messages)).toBe(
      'Weather data could not be loaded',
    );
    expect(dataLoadErrorMessage({ webcamOk: true, temperatureOk: true, windOk: true, sunshineOk: false }, messages)).toBe(
      'Weather data could not be loaded',
    );
  });

  test('joins webcam and weather failures', () => {
    expect(dataLoadErrorMessage({ webcamOk: false, temperatureOk: false, windOk: false, sunshineOk: true }, messages)).toBe(
      'Webcam list could not be loaded. Weather data could not be loaded',
    );
  });
});
