const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export type CompassPoint = (typeof COMPASS_POINTS)[number];

// Nearest of the eight compass points for a bearing in degrees
export const compassDirection = (degrees: number): CompassPoint => {
  const normalized = ((degrees % 360) + 360) % 360;

  return COMPASS_POINTS[Math.round(normalized / 45) % COMPASS_POINTS.length];
};
