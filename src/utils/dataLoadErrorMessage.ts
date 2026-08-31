export const dataLoadErrorMessage = (webcamOk: boolean, temperatureOk: boolean, windOk: boolean): string | null => {
  const parts: string[] = [];

  if (!webcamOk) {
    parts.push('Webcam list could not be loaded');
  }

  if (!temperatureOk || !windOk) {
    parts.push('Weather data could not be loaded');
  }

  return parts.length > 0 ? parts.join('. ') : null;
};
