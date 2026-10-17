type DataLoadFlags = {
  webcamOk: boolean;
  temperatureOk: boolean;
  windOk: boolean;
  sunshineOk: boolean;
};

export type DataLoadError = 'webcamList' | 'weatherData';

// Joins the localized messages of the failed sources, or null when everything loaded
export const dataLoadErrorMessage = (
  { webcamOk, temperatureOk, windOk, sunshineOk }: DataLoadFlags,
  messages: Record<DataLoadError, string>,
): string | null => {
  const errors: DataLoadError[] = [];

  if (!webcamOk) {
    errors.push('webcamList');
  }

  if (!temperatureOk || !windOk || !sunshineOk) {
    errors.push('weatherData');
  }

  return errors.length > 0 ? errors.map((error) => messages[error]).join('. ') : null;
};
