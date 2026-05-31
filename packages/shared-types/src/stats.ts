export type StatsSummary = {
  totalDetections: number;
  byClass: Record<string, number>;
};

export type HeatmapPoint = {
  lat: number;
  lon: number;
  weight: number;
};
