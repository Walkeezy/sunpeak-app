type DataLoadFlags = {
  webcamOk: boolean;
  temperatureOk: boolean;
  windOk: boolean;
};

export const dataLoadErrorMessage = ({ webcamOk, temperatureOk, windOk }: DataLoadFlags): string | null => {
  const parts: string[] = [];

  if (!webcamOk) {
    parts.push('Webcam list could not be loaded');
  }

  if (!temperatureOk || !windOk) {
    parts.push('Weather data could not be loaded');
  }

  return parts.length > 0 ? parts.join('. ') : null;
};
